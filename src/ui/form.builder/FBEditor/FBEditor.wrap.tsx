import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorProps, FBEditorState } from "..";
import { SM } from "../../../App";

export const withFBEditor = <T extends FBEditorProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    editorState,
    isFormOutput,
    mode,
    ...props
  }: T) => {

    const { workspaceState, leftPanelEditorState } = FB.useStores();
    editorState = SM.isNewLayout ? leftPanelEditorState :  FB.useRef<FBEditorState>(FBEditorState);
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
