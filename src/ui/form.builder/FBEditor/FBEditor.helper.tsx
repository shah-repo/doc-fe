import { filter, includes, size, union } from "lodash";
import React from "react";
import { FB, FBData, FBEditorActions, FBEditorHelperProps, FBEditorState, FBEditorTitle, FBInputProps, FBInputType } from "..";
import { SM } from "../../../App";

export const withFBEditorHelper = <T extends FBEditorHelperProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    openEditor,
    ...props
  }: T) => {
    const { dialogState, workspaceState, formState, leftPanelState } = FB.useStores();
    const { _documentRevisionFormState, _tabsState } = SM.useStores();
    function defaultProps(props: Partial<FBInputProps>): Partial<FBInputProps> {
      const { type, stepIndex } = props;
      if (includes(FBEditorState.pickStepIndex, type)) {
        const stepSections = filter(workspaceState?.getSchema(), (schemaItem) =>
          !schemaItem.deleted && includes(FBEditorState.pickStepIndex, schemaItem.type));
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
    const onFBEditorClose = () => {
      leftPanelState?.closeDialog();
    };
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

      if (!_documentRevisionFormState?.leftPanelOpen) { _documentRevisionFormState?.setLeftPanelOpen(); }
      if (leftPanelState) {
        leftPanelState.setIndex(index || 0);
        _documentRevisionFormState?.setTabIdForSchemaAddition(_tabsState?.activeTabId || "");
        leftPanelState.config({
          open: true,
          showLeftPanelEditor: true,
          title: <FBEditorTitle type={type} onFBEditorClose={onFBEditorClose} underValidation={underValidation}/>,
          maxWidth: "sm",
          content: editorForm,
          actions: (
            <FBEditorActions
              key={`fb-editor-actions-${type}`}
              parentFormState={formState}
              outerContainerMargin={0}
              {...{ type, index }} />
          ),
        });
      } else {
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

      }
    };

    return Component({
      ...(props as T),
      openEditor,
    });
  };

  return (props: T) => Comp(props);
};
