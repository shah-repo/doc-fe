import _ from "lodash";
import React from "react";
import { FBEditorHelperProps } from ".";
import { FB, FBEditorActions, FBEditorState, FBEditorTitle, FBInputProps } from "..";

export const withFBEditorHelper = <T extends FBEditorHelperProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    openEditor,
    ...props
  }: T) => {

    const { dialogState, workspaceState } = FB.useStores();

    function defaultProps(props: Partial<FBInputProps>): Partial<FBInputProps> {
      const { type, stepIndex } = props;
      if (type === "stepsection") {
        const stepSections = _.filter(workspaceState?.getSchema(), { type: "stepsection" });
        props = {
          ...props,
          stepIndex: stepIndex || (_.size(stepSections) + 1),
        };
      }
      return props;
    }

    openEditor = (props?: Partial<FBInputProps>) => () => {
      const { type, index } = props || {};
      if (!type) {
        return;
      }

      const editorForm = FBEditorState.editor({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inputProps: defaultProps(props!),
      });
      if (!editorForm) {
        return;
      }
      const { underValidation } = editorForm.props;

      dialogState && dialogState.config({
        open: true,
        title: underValidation ? <FBEditorTitle /> : "form.builder.create.field",
        maxWidth: "sm",
        content: editorForm,
        actions: <FBEditorActions key={`fb-editor-actions-${type}`} {...{ type, index }} />,
      });
    };

    return Component({
      ...(props as T),
      openEditor,
    });
  };

  return (props: T) => Comp(props);
};
