import React from "react";
import { FB, FBEQMaintenanceProps, FBEQMaintenanceState } from "..";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAdd,
    eqMaintenanceState,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const { id: docRevId } = workspaceState || {};
    eqMaintenanceState = FB.useRef(FBEQMaintenanceState);

    // MARK: @reactions

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId) { return; }
      window.open(`/document_revision/create_maintenance/${docRevId}`);
    };

    // MARK: @observer

    return Component({
      ...(props as T),
      handleAdd,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
