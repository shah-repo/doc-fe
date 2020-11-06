import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEQMaintenanceHistoryProps, FBEQMaintenanceHistoryState } from "..";

export const withFBEQMaintenanceHistory = <T extends FBEQMaintenanceHistoryProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    eqMaintenanceHistoryState,
    maintenanceHistory,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const { id } = workspaceState || {};
    eqMaintenanceHistoryState = FB.useRef(FBEQMaintenanceHistoryState, id);

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      maintenanceHistory = eqMaintenanceHistoryState?.maintenanceHistory?.[name || ""];
    });

    if (!maintenanceHistory) {
      return null;
    }

    return Component({
      ...(props as T),
      maintenanceHistory,
    });
  };

  Comp.displayName = "withFBEQMaintenanceHistory";
  return Comp;
};
