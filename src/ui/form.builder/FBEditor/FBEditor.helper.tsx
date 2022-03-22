import { filter, includes, size, union } from "lodash";
import React from "react";
import { FB, FBData, FBEditorActions, FBEditorHelperProps, FBEditorState, FBEditorTitle, FBInputProps, FBInputType } from "..";
import { SM } from "../../../App";
import Colors from "../../layout/theme/utils/colors";

export const withFBEditorHelper = <T extends FBEditorHelperProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    openEditor,
    ...props
  }: T) => {
    const { dialogState, workspaceState, formState, leftPanelDialogState } = FB.useStores();
    const { _documentRevisionFormState } = SM.useStores();
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
    const onTypeClick = () => {
      leftPanelDialogState?.closeDialog();
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
      if (leftPanelDialogState) {
        leftPanelDialogState.setIndex(index || 0);
        leftPanelDialogState.config({
          open: true,
          showLeftPanelEditor: true,
          title: <FBEditorTitle type={type} onTypeClick={onTypeClick} underValidation={underValidation}/>,
          maxWidth: "sm",
          content: editorForm,
          actions: (
            <FBEditorActions
              key={`fb-editor-actions-${type}`}
              parentFormState={formState}
              outerContainerMargin={0}
              submitStyle = {{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                width: "66px",
                height: "36px",
                background: `${Colors.navy}`,
                borderRadius: "100px",
                color: "white",
                textTransform: "capitalize",
                fontFamily: "Sora",
                fontStyle: "normal",
                fontSize: "12px",
                lineHeight: "15px",
                border: `1px solid ${Colors.navy}`,
              }}
              cancelStyle = {{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                width: "83px",
                height: "36px",
                background: `${Colors.sky_blue}`,
                borderRadius: "100px",
                color: "#011FBB",
                textTransform: "capitalize",
                fontFamily: "Sora",
                fontStyle: "normal",
                fontSize: "12px",
                lineHeight: "15px",
                border: `1px solid ${Colors.sky_blue}`,
              }}
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
