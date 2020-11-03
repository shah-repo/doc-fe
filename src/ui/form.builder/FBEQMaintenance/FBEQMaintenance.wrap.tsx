import React from "react";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }) =>
  // MARK: @config
  // MARK: @methods
  // MARK: @reactions
  // MARK: @observer
    Component({
      ...(props as T),
    })
  ;

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
