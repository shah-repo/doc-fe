import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { isEmpty, lowerCase } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { AvailableMaintenanceForm, FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";

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
    const complianceDueDate = dueDate && getFormattedDateString(dueDate, MomentFormats.DayMonthDateYear);
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

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId && !pmFormId) { return; }
      window.open(`/document_revision/${pmFormId}/create_maintenance/${docRevId}/${name}`);
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
