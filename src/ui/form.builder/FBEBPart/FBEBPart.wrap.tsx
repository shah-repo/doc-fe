import React from "react";
import { FB, FBEBPartProps } from "..";

export const withFBEBPart = <T extends FBEBPartProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    ...props
  }) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const { id: documentId } = workspaceState || {};

    // MARK: @methods
    const onAddClick = () => {
      window.open(`/document_revision/create_part/${documentId}`);
    };

    return Component({
      ...(props as T),
      onAddClick,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
