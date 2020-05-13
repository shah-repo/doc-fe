import _, { Dictionary } from "lodash";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FB, FBData, FBSchemaProps } from "..";
import { withFBValidation } from "../FBValidation/FBValidation.wrap";
import { FBOptionProps } from "../types/common";

export const withFBEditorActions = <T extends FBEditorActionsProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    handleCancel,
    parentFormState,
    toStringRules,
    index = 0,
    type,
    ...props
  }: T) => {

    const { dialogState, workspaceState, formState } = FB.useStores();
    const { isOutput } = workspaceState || {};

    function editorOptions(formValues: Dictionary<any> = {}): FBOptionProps[] | undefined {
      const { options } = formValues;
      if (!options || !_.isString(options)) {
        return options;
      }
      return _.map((options).split("\n"), (text) => ({
        value: _.kebabCase(text),
        text,
      }));
    }

    function propertiesOptions(formValues?: Dictionary<any>): FBOptionProps[] | undefined {
      const options = editorOptions(formValues);
      if (options && formValues?.editorProperties && type) {
        _.map(FBData.editorProperties[type], (ep) => {
          if (_.includes(formValues.editorProperties, ep.value)) {
            const propOption = { ...ep, text: ep.outputText };
            ep.value === "includeNone"
              ? options[0] = propOption
              : options.push(propOption);
          }
        });
      }
      return options;
    }

    function additionalSchema() {
      if (!type) { return; }
      const additionalSchema = FBData.additionalSchema(type);
      if (!workspaceState?.getSchemaItemAt(index) && additionalSchema) {
        workspaceState?.setSchema(_.union(workspaceState.getSchema(), additionalSchema));
        index = index + _.size(additionalSchema);
      }
    }

    function handleAddOutput(formValues: FBSchemaProps) {
      const { name } = formValues;
      parentFormState?.setFieldValue(name, formValues, true);
      dialogState?.closeDialog();
    }

    handleAdd = () => {
      if (!type) { return; }
      const formValues = formState?.getValues();
      if (isOutput) {
        handleAddOutput(formValues);
        return;
      }
      const options = propertiesOptions(formValues);
      additionalSchema();
      workspaceState?.setSchemaItemAt({
        index,
        type,
        name: `${_.kebabCase(formValues?.label)}-${FB.uniqid}`,
        ...formValues,
        ...options && { options },
        ...formValues?.validators && toStringRules && { rules: toStringRules(formValues.validators) },
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

  return withFBValidation((props: T) => Comp(props));
};
