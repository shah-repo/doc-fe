import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";
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
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { id: docRevId, document: { status = "" } = {} } = workspaceState || {};
    const isEqStatusDraft = status === DocumentRevisionStatus.Draft;
    const isTypePM = editorConfig.type?.includes("preventativeMaintenance");
    const complianceStatus = formState?.getFieldValue(`${name}.status`);
    const dueDate = formState?.getFieldValue(`${name}.complianceDueDate`);
    const complianceDueDate = dueDate && getFormattedDateString(dueDate, MomentFormats.DayMonthDateYear);

    eqMaintenanceState = FB.useRef(FBEQMaintenanceState);
    pmFormId = formState?.getFieldValue(`${name}.preventativeForm`);

    // MARK: @reactions
    // Set pm form id on form select
    useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.preventativeForm`)?.value,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      (id) => (pmFormId = id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

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
      ) || isEqStatusDraft;
    }

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId && !pmFormId) { return; }
      window.open(`/document_revision/${pmFormId}/create_maintenance/${docRevId}/${name}`);
    };

    // MARK: @observer
    useObserver(() => {
      isNewPMDisabled = (
        eqMaintenanceState?.newPMDisabled ||
        newPMDisabled()
      );
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
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
