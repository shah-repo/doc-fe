import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorProps, FBEditorState } from "..";
import { checkIsDocumentEB, checkIsDocumentPart } from "../../../ui/documentRevision/helpers/checkDocumentGroup";

export const withFBEditor = <T extends FBEditorProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    editorState,
    hideEditorProperties,
    mode,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    editorState = editorState || FB.useRef<FBEditorState>(FBEditorState);
    const isEB = checkIsDocumentEB(workspaceState?.document?.document.documentType.groupOptions);
    const isPart = checkIsDocumentPart(workspaceState?.document?.document.documentType.groupOptions);
    hideEditorProperties = workspaceState?.mode === "formDesign" && !(isEB || isPart);

    useObserver(() => {
      mode = editorState?.mode;
    });

    return Component({
      ...(props as T),
      editorState,
      hideEditorProperties,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
