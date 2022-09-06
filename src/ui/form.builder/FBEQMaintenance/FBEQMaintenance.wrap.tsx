import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { isEmpty, lowerCase } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { AvailableMaintenanceForm, FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import {
  DocumentRevision,
  DocumentRevisionStatus,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions/types";
import useAsync from "../../hooks/useAsync";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import useActionCreator from "../../hooks/useActionCreator";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { toastError } from "../../components/notifications";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    eqMaintenanceState,
    isNewPMDisabled,
    pmFormId,
    name = "",
    editorConfig,
    availableMaintenanceForms,
    preventativeFormOptions,
    getOptionLabel,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const fbEqMaintenanceState = FB.useRef(FBEQMaintenanceState);
    const { id: docRevId, document: { status = "" } = {} } = workspaceState || {};
    const isEqStatusReleased = status === DocumentRevisionStatus.Released;
    const isTypePM = editorConfig.type?.includes("preventativeMaintenance");
    const complianceStatus = formState?.getFieldValue(`${name}.status`);
    const dueDate = formState?.getFieldValue(`${name}.complianceDueDate`);
    const complianceDueDate = dueDate && getFormattedDateString(dueDate, MomentFormats.DayMonthDateYearAlt);
    availableMaintenanceForms = fbEqMaintenanceState?.availableMaintenanceFormsApi.data;

    useEffect(() => {
      fbEqMaintenanceState?.getAvailableMaintenanceForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    eqMaintenanceState = FB.useRef(FBEQMaintenanceState);
    pmFormId = formState?.getFieldValue(`${name}.preventativeForm`);
    if (pmFormId && availableMaintenanceForms) {
      const maintenanceForm = availableMaintenanceForms?.find((e) => e.id === pmFormId);
      const lastReleased = maintenanceForm?.documentRevisions?.find((rev) =>
        rev.status === DocumentRevisionStatus.Released);
      pmFormId = lastReleased?.id;
    }
    // MARK: @reactions

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

    // MARK: @helpers
    function newPMDisabled(): boolean {
      return !(
        formState?.getFieldValue(`${name}.preventativeForm`) &&
        formState?.getFieldValue(`${name}.frequency`)
      ) || !isEqStatusReleased || isEmpty(pmFormId);
    }

    const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        console.log(createdDocumentRevision);
      },
      onError: (error) => {
        toastError(error);
      },
    });
    const create = useActionCreator(documentRevisionsActions.create);

    // const pmForm = useSelector((state: ApplicationState) =>
    //   documentRevisionsSelectors.getDocumentRevision(state, pmFormId || ""));

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId && !pmFormId) { return; }

      const values: DocumentRevisionFormValues = {
        formDocument: {
          id: pmFormId,
        },
        parentEquipment: {
          id: docRevId as string,
        },
        equipmentSection: name,
        document: {
          docId: "123", // todo: gen correct id
          documentType: {
            id: "1f6ddb7f-8a76-4491-8a70-b9af5827543e", // todo: take correct doc type
          },
        },
        revisionChangeType: RevisionChangeType.NextRevision,
        name: "",
        description: "",
        revisionStage: 1, // todo: take default revision stage
        retrain: false,
        attachments: [],
        referenceTo: [],

        securityEmployees: [], // todo
        securityGroups: [], // todo
        operators: [], // todo
      };

      // REQ: It only has to be populated if there is one output type
      // const pmFormOutput = pmForm?.formTemplate?.outputDocumentTypes;
      // if (pmFormOutput?.length === 1) {
      //   values.document = {
      //     ...values.document,
      //     documentType: pmFormOutput[0] as FBOutputDocumentType,
      //   };
      // }

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

    // MARK: @observer
    useObserver(() => {
      isNewPMDisabled = (
        eqMaintenanceState?.newPMDisabled ||
        newPMDisabled()
      );
      availableMaintenanceForms = fbEqMaintenanceState?.availableMaintenanceFormsApi.data;
    });

    return Component({
      ...(props as T),
      handleAdd,
      complianceDueDate,
      complianceStatus,
      isNewPMDisabled,
      name,
      editorConfig,
      isTypePM,
      preventativeFormOptions,
      getOptionLabel,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
