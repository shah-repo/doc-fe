import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    getCurrentStatus,
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
    const complianceDueDate = formState?.getFieldValue(`${name}.complianceDueDate`);

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

    // eslint-disable-next-line react/display-name
    getCurrentStatus = () => {
      if (!complianceDueDate) { return null; }
      return <span>
        <b>Current Status: </b>
        {complianceStatus}
        <span> - Due Date: </span>
        {getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearAlt)}
      </span>;
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
      getCurrentStatus,
      isNewPMDisabled,
      name,
      editorConfig,
      isTypePM,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
