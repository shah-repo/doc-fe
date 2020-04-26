import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBEditorProps, FBEditorState } from ".";
import { FB } from "..";

export const withFBEditor = <T extends FBEditorProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    editorState,
    initialValues = {},
    children,
    mode,
    index,
    type,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    editorState = FB.useRef<FBEditorState>(FBEditorState);

    !_.isUndefined(index) && (initialValues = workspaceState?.getSchemaItemAt(index) || {});

    useObserver(() => {
      mode = editorState?.mode;
    });

    return Component({
      ...(props as T),
      editorState,
      initialValues,
      children,
      mode,
      index,
      type,
    });
  };

  return (props: T) => Comp(props);
};
