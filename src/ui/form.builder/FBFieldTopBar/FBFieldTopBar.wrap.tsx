import { useObserver } from "mobx-react";
import React from "react";
import { FBFieldTopBarProps } from ".";
import { FB } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";

export const withFBFieldTopBar = <T extends FBFieldTopBarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    openEditor,
    index,
    ...props
  }: T) => {

    const { fieldWrapperState, workspaceState } = FB.useStores();
    const { type } = workspaceState?.getSchemaItemAt(index) || {};

    const editSchemaItem = () => {
      openEditor && type && openEditor(type, index)();
    };
    const removeSchemaItem = () => {
      workspaceState?.removeSchemaItemAt(index);
    };
    const markDownSchemaItem = () =>
      fieldWrapperState?.setMarkDownActive(!fieldWrapperState.markDownVisible);
    return useObserver(() => Component({
      ...(props as T),
      editSchemaItem,
      removeSchemaItem,
      markDownSchemaItem,
    }));
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
