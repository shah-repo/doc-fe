import { useObserver } from "mobx-react";
import React from "react";
import { FBEditorProps, FBEditorState } from ".";
import { FB } from "..";

export const withFBEditor = <T extends FBEditorProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    editorState,
    mode,
    ...props
  }: T) => {

    editorState = FB.useRef<FBEditorState>(FBEditorState);

    useObserver(() => {
      mode = editorState?.mode;
    });

    return Component({
      ...(props as T),
      editorState,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
