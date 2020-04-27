import React from "react";
import { FBEditorHelperProps } from ".";
import { FB, FBEditorActions, FBEditorState, FBEditorTitle, FBInputType } from "..";

export const withFBEditorHelper = <T extends FBEditorHelperProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    openEditor,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    openEditor = (type: FBInputType, index?: number) => () => {
      const editorForm = FBEditorState.editor({ type, index });
      if (!editorForm) {
        return;
      }
      const { underValidation } = editorForm.props;
      dialogState && dialogState.config({
        open: true,
        title: underValidation ? <FBEditorTitle /> : "form.builder.create.field",
        maxWidth: "sm",
        content: editorForm,
        actions: <FBEditorActions key={`fb-editor-actions-${type}`} {...{ type }} />,
      });
    };

    return Component({
      ...(props as T),
      openEditor,
    });
  };

  return (props: T) => Comp(props);
};
