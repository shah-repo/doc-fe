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
    inputProps,
    inputProps: { type } = {},
    ...props
  }: T) => {

    const { fieldWrapperState, workspaceState } = FB.useStores();

    const editSchemaItem = () => {
      openEditor && type && openEditor(inputProps)();
    };

    const removeSchemaItem = () => {
      workspaceState?.removeSchemaItem(inputProps);
    };
    const markDownSchemaItem = () =>
      fieldWrapperState?.setMarkDownActive(!fieldWrapperState.markDownVisible);
    
      return useObserver(() => Component({
      ...(props as T),
      editSchemaItem,
      removeSchemaItem,
      markDownSchemaItem,
      inputProps,
    }));
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
