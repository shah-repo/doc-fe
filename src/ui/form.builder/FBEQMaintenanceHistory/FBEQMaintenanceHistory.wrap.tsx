import React from "react";
import { FB, FBEQMaintenanceHistoryProps, FBEQMaintenanceHistoryState } from "..";

export const withFBEQMaintenanceHistory = <T extends FBEQMaintenanceHistoryProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    eqMaintenanceHistoryState,
    ...props
  }: T) => {

    // MARK: @config
    eqMaintenanceHistoryState = FB.useRef(FBEQMaintenanceHistoryState);

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
    });
  };

  Comp.displayName = "withFBEQMaintenanceHistory";
  return Comp;
};
