import React from "react";
import { FB, FBRequestApprovalProps } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";

export const withFBRequestApproval = <T extends FBRequestApprovalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAddEdit,
    openEditor,
    name,
    defaultValue,
    type,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    const { isOutput } = workspaceState || {};

    handleAddEdit = () =>
      openEditor && openEditor({
        ...defaultValue,
        type,
        name,
      })();

    return Component({
      ...(props as T),
      handleAddEdit,
      defaultValue,
      isOutput,
      name,
      type,
    });
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
