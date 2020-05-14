import _, { Dictionary } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBEditorActionsProps } from ".";
import { FB, FBData, FBEditorPropertiesOption, FBOption, FBSchemaProps } from "..";
import { isTranslation } from "../../translations/types";
import { withFBValidation } from "../FBValidation/FBValidation.wrap";

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
    const intl = useIntl();

    function editorOptions(formValues: Dictionary<any> = {}): FBOption[] | undefined {
      const { options } = formValues;
      if (!options || !_.isString(options)) {
        return options;
      }
      return _.map((options.replace(/^\s+|\s+$/g, "")).split("\n"), (text) => ({
        value: _.kebabCase(text),
        text,
      }));
    }

    function propertiesOptions(formValues?: Dictionary<any>): FBOption[] | undefined {
      if (!type) { return; }
      let options = editorOptions(formValues);
      // TODO: dist editor options type
      if (type === "autocomplete" || type === "autocompleteasync") {
        return options;
      }
      const { editorProperties = [] } = formValues || {};
      // TOD: optimize types
      options = (FBData.editorProperties[type] || []).reduce((acc, item) => {
        let { outputText: text } = item;
        const { value } = item;
        if (!editorProperties.includes(value)) { return acc; }
        if (!text) { return acc; }
        isTranslation(text) && (text = intl.formatMessage({ id: text }));
        const propOption = { value, text };
        if (value === "includeNone") {
          _.first(options)?.value !== "includeNone" && (acc.splice(0, 0, propOption));
        } else {
          acc = _.union(acc, [propOption]);
        }
        return acc;
      }, options as FBEditorPropertiesOption[] || []);

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
      const formValues = {
        ...formState?.initialValues,
        ...formState?.getValues(),
      };
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
