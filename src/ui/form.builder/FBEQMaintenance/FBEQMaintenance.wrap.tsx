import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    eqMaintenanceState,
    name = "",
    ...props
  }: T) => {

    // MARK: @config
    let pmFormId = "";
    let isNewPMDisabled;
    const { workspaceState, formState } = FB.useStores();
    const { id: docRevId } = workspaceState || {};
    const currentStatus = workspaceState?.document?.formInput?.[name]?.status;
    eqMaintenanceState = FB.useRef(FBEQMaintenanceState);
    // MARK: @reactions

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId && !pmFormId) { return; }
      window.open(`/document_revision/${pmFormId}/create_maintenance/${docRevId}/${name}`);
    };

    // MARK: @observer
    useObserver(() => {
      // What are our intentions with this observer?
      pmFormId = formState?.inputState.get("preventativeMaintenanceForm")?.value;
    });

    useObserver(() => {
      isNewPMDisabled = (
        !formState?.inputState.get("preventativeMaintenanceForm")?.value ||
        !formState?.inputState.get(`${name}.frequency`)?.value
      );
    });

    return Component({
      ...(props as T),
      handleAdd,
      isNewPMDisabled,
      name,
      currentStatus,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
