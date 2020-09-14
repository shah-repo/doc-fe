import { isString, kebabCase, size, union } from "lodash";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FB, FBData, FBSchemaProps } from "..";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { withFBValidation } from "../FBValidation/FBValidation.wrap";

export const withFBEditorActions = <T extends FBEditorActionsProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    handleCancel,
    stringToOptions,
    parentFormState,
    toStringRules,
    index = 0,
    type,
    ...props
  }: T) => {

    const { dialogState, workspaceState, formState } = FB.useStores();
    const { isOutput } = workspaceState || {};

    function additionalSchema() {
      if (!type) { return; }
      const additionalSchema = FBData.additionalSchema(type);
      if (!workspaceState?.getSchemaItemAt(index) && additionalSchema) {
        workspaceState?.setSchema(union(workspaceState.getSchema(), additionalSchema));
        index = index + size(additionalSchema);
      }
    }

    function handleAddOutput(formValues: FBSchemaProps) {
      const { name } = formValues;
      parentFormState?.setFieldValue(name, formValues, true);
      dialogState?.closeDialog();
    }

    handleAdd = () => {
      if (!type) { return; }
      const formValues: FBSchemaProps = formState?.getValues() as FBSchemaProps;
      const { options, validators, label, editorProperties } = formValues;
      if (isOutput) {
        handleAddOutput(formValues);
        return;
      }
      additionalSchema();
      workspaceState?.setSchemaItemAt({
        index,
        type,
        name: `${kebabCase(label as string)}-${FB.uniqid}`,
        ...formValues,
        ...isString(options) && stringToOptions && { options: stringToOptions(options, editorProperties) },
        ...validators && toStringRules && { rules: toStringRules(validators) },
        applicableOn: ["ON_STATE_TO_IN_REVIEW"],
      }, index);
      dialogState?.closeDialog();
    };

    handleCancel = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      handleAdd,
      handleCancel,
      type,
    });
  };

  return withFBEditorOptions(withFBValidation((props: T) => Comp(props)));
};
