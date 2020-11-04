import React from "react";
import { FB } from "..";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }) => {
  // MARK: @config
    const { workspaceState } = FB.useStores();
    const { id: docRevId } = workspaceState || {};

    // MARK: @methods
    const onAddClick = () => {
      window.open(`/document_revision/create_maintenance/${docRevId}`);
    };
    // MARK: @reactions
    // MARK: @observer
    return Component({
      ...(props as T),
      onAddClick,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
