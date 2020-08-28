import { filter, includes, size, union } from "lodash";
import React from "react";
import { FBEditorHelperProps } from ".";
import { FB, FBEditorActions, FBEditorState, FBEditorTitle, FBInputProps } from "..";
import { FBData } from "../FBData";
import { FBInputType } from "../FBInput";

export const withFBEditorHelper = <T extends FBEditorHelperProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    openEditor,
    ...props
  }: T) => {

    const { dialogState, workspaceState, formState } = FB.useStores();

    function defaultProps(props: Partial<FBInputProps>): Partial<FBInputProps> {
      const { type, stepIndex } = props;
      if (includes(FBEditorState.pickStepIndex, type)) {
        const stepSections = filter(workspaceState?.getSchema(), (schemaItem) =>
          includes(FBEditorState.pickStepIndex, schemaItem.type));
        props = {
          ...props,
          stepIndex: stepIndex || (size(stepSections) + 1),
        };
      }
      return props;
    }

    function addTestStep() {
      workspaceState?.setSchema(union(workspaceState.schema, FBData.testStepSchema));
      dialogState?.closeDialog();
    }

    function customHandler(type: FBInputType) {
      const handler: Partial<Record<FBInputType, () => any>> = {
        teststep: () => addTestStep(),
      };
      handler[type]?.();
    }

    openEditor = (props?: Partial<FBInputProps>) => () => {
      const { type, index } = props || {};
      if (!type) {
        return;
      }
      if (includes(FBEditorState.pickCustomHandler, type)) {
        return customHandler(type);
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
        actions: (
          <FBEditorActions
            key={`fb-editor-actions-${type}`}
            parentFormState={formState}
            {...{ type, index }} />
        ),
      });
    };

    return Component({
      ...(props as T),
      openEditor,
    });
  };

  return (props: T) => Comp(props);
};
