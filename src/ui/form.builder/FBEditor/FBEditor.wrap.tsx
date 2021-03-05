import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorProps, FBEditorState } from "..";

export const withFBEditor = <T extends FBEditorProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    editorState,
    isFormOutput,
    mode,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    editorState = FB.useRef<FBEditorState>(FBEditorState);
    isFormOutput = workspaceState?.mode === "formDesign";

    useObserver(() => {
      mode = editorState?.mode;
    });

    return Component({
      ...(props as T),
      editorState,
      isFormOutput,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
