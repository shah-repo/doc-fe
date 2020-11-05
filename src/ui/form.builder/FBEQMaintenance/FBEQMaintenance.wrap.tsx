import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    eqMaintenanceState,
    name,
    ...props
  }: T) => {

    // MARK: @config
    let pmFormId = "";
    const { workspaceState, formState } = FB.useStores();
    const { id: docRevId } = workspaceState || {};
    eqMaintenanceState = FB.useRef(FBEQMaintenanceState);

    // MARK: @reactions

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId && !pmFormId) { return; }
      window.open(`/document_revision/${pmFormId}/create_maintenance/${docRevId}?equipmentSection=${name}`);
    };

    // MARK: @observer
    useObserver(() => {
      // What are our intentions with this observer?
      pmFormId = formState?.inputState.get("preventativeMaintenanceForm")?.value;
    });

    return Component({
      ...(props as T),
      handleAdd,
      name,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
