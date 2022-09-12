import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { lowerCase } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { AvailableMaintenanceForm, FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import {
  DocumentRevision,
  DocumentRevisionStatus, FBOutputDocumentType,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions/types";
import useAsync from "../../hooks/useAsync";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import useActionCreator from "../../hooks/useActionCreator";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { toastError } from "../../components/notifications";
import { documentVersionPath } from "../../document.revision/utils/paths";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { filterSecurityGroupsForQms } from "../../documentType/list/helpers";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    eqMaintenanceState,
    isNewPMDisabled,
    isNewPMLoading,
    pmFormId,
    name = "",
    editorConfig,
    availableMaintenanceForms,
    preventativeFormOptions,
    getOptionLabel,
    maintenanceHistory,
    ...props
  }: T) => {
    eqMaintenanceState = FB.useRef(FBEQMaintenanceState);

    const { workspaceState, formState } = FB.useStores();
    const { id: docRevId, document: { status = "" } = {} } = workspaceState || {};
    const isEqStatusReleased = status === DocumentRevisionStatus.Released;
    const isTypePM = editorConfig.type?.includes("preventativeMaintenance");
    const complianceStatus = formState?.getFieldValue(`${name}.status`);
    const dueDate = formState?.getFieldValue(`${name}.complianceDueDate`);
    const complianceDueDate = dueDate && getFormattedDateString(dueDate, MomentFormats.DayMonthDateYearAlt);
    availableMaintenanceForms = eqMaintenanceState?.availableMaintenanceFormsApi.data;

    useEffect(() => {
      eqMaintenanceState?.getAvailableMaintenanceForms();
      eqMaintenanceState?.getMaintenanceHistory(docRevId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    pmFormId = formState?.getFieldValue(`${name}.preventativeForm`);
    let lastReleasedMaintenanceForm: DocumentRevision | undefined;
    if (pmFormId && availableMaintenanceForms) {
      const maintenanceForm = availableMaintenanceForms?.find((e) => e.id === pmFormId);
      lastReleasedMaintenanceForm = maintenanceForm?.documentRevisions?.find((rev) =>
        rev.status === DocumentRevisionStatus.Released);
      pmFormId = lastReleasedMaintenanceForm?.id;
    }

    // Set new pm button disabled status.
    useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.preventativeForm`)?.value,
      () => eqMaintenanceState?.setNewPMDisabled(newPMDisabled())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.frequency`)?.value,
      () => eqMaintenanceState?.setNewPMDisabled(newPMDisabled())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function newPMDisabled(): boolean {
      return !(
        formState?.getFieldValue(`${name}.preventativeForm`) &&
        formState?.getFieldValue(`${name}.frequency`)
      ) || !isEqStatusReleased || !pmFormId || !lastReleasedMaintenanceForm
        || Boolean(eqMaintenanceState?.newPMLoading);
    }

    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const documentTypesById = useSelector(documentTypeSelectors.byId);

    const create = useActionCreator(documentRevisionsActions.create);
    const async = useAsync<DocumentRevision>({
      onSuccess: (data) => {
        eqMaintenanceState?.getMaintenanceHistory(docRevId as string);
        window.open(
          documentVersionPath(data?.id as string, data?.document?.id as string),
          "_blank"
        );
        eqMaintenanceState?.setNewPMLoading(false);
        eqMaintenanceState?.setNewPMDisabled(newPMDisabled());
      },
      onError: (error) => {
        toastError(error);
        eqMaintenanceState?.setNewPMLoading(false);
        eqMaintenanceState?.setNewPMDisabled(newPMDisabled());
      },
    });

    handleAdd = async () => {
      if (!docRevId || !lastReleasedMaintenanceForm) {
        return;
      }

      eqMaintenanceState?.setNewPMLoading(true);

      const values: DocumentRevisionFormValues = {
        formDocument: { id: lastReleasedMaintenanceForm.id },
        parentEquipment: { id: docRevId },
        equipmentSection: name,
        revisionChangeType: RevisionChangeType.NextRevision,
        name: "",
        description: "",
        revisionStage: 3,
        retrain: false,
        attachments: [],
        referenceTo: [],
        securityEmployees: [],
        securityGroups: [],
        operators: [],
      };

      // REQ: It only has to be populated if there is one output type
      const pmFormOutput = lastReleasedMaintenanceForm?.formTemplate?.outputDocumentTypes;
      if (pmFormOutput?.length === 1) {
        const shortDocumentType = pmFormOutput[0] as FBOutputDocumentType;
        const documentType = documentTypesById[shortDocumentType.id] ?? {};

        try {
          const { docId } = await eqMaintenanceState?.getProposedId(documentType.id);

          values.document = {
            docId,
            documentType,
          };
        } catch (error) {
          return async.errorHandler.execute(error);
        }

        values.securityGroups = filterSecurityGroupsForQms(documentType.isQms, groupOptions);
      }

      const body = toNewVersionRequestBody(values);

      async.start(create, body, async);
    };

    const filterOutOption = (docRev: AvailableMaintenanceForm, inputValue: string ) => {
      const filterValue = lowerCase(inputValue);

      return lowerCase(docRev.name).includes(filterValue) ||
             lowerCase(docRev.docId).includes(filterValue);
    };

    function handleFilter(
      data: AvailableMaintenanceForm[],
      state: FilterOptionsState,
    ) {
      const typeValue = formState?.getFieldValue(`${name}.preventativeForm`);
      const { inputValue = "" } = state || {};
      const options = data?.filter((form) =>
        filterOutOption(form, inputValue) &&
        form.documentRevisions.some((doc) =>
          doc.status === DocumentRevisionStatus.Released && form.id !== typeValue ));
      return options;
    }

    preventativeFormOptions = (options, state) =>
      handleFilter(options, state);

    getOptionLabel = (option) => {
      if (!option?.documentRevisions?.find((doc) => doc.status === DocumentRevisionStatus.Released)) {
        const title = option?.documentRevisions.find((doc) => doc.status === DocumentRevisionStatus.Obsolete)?.name;
        return `${option.docId} - OBS - ${title}`;
      }
      return `${option.docId} - rev ${option.displayRevision} - ${option.name}`;
    };

    useObserver(() => {
      isNewPMDisabled = eqMaintenanceState?.newPMDisabled || newPMDisabled();
      isNewPMLoading = eqMaintenanceState?.newPMLoading || eqMaintenanceState?.availableMaintenanceFormsApi.loading;
      availableMaintenanceForms = eqMaintenanceState?.availableMaintenanceFormsApi.data;
      maintenanceHistory = eqMaintenanceState?.maintenanceHistoryApi.data?.[name];
    });

    return Component({
      ...(props as T),
      handleAdd,
      complianceDueDate,
      complianceStatus,
      isNewPMDisabled,
      isNewPMLoading,
      name,
      editorConfig,
      isTypePM,
      preventativeFormOptions,
      getOptionLabel,
      maintenanceHistory,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
