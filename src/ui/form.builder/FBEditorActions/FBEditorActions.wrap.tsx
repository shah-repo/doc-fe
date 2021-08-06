/* eslint-disable max-len */
import { compact, filter, isEmpty, isString, kebabCase, omit, size, union } from "lodash";
import React from "react";
import { editorPropertiesFlags, FB, FBData, FBEditorActionsProps, FBSchemaProps } from "..";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { COMMON_INITIAL_VALUES } from "../FBInput/FBInput.wrap";
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

    if (workspaceState?.getSchemaItemAt(index)?.deleted) {
      index = size(workspaceState?.getSchema());
    }

    function additionalSchema() {
      if (!type) { return; }
      let additionalSchema = FBData.additionalSchema(type);

      // Filter out uniqueInSchema els if type is already in the scheme
      additionalSchema = filter(additionalSchema, (schemaItem) => {
        const { type, uniqueSchemaItem } = schemaItem;
        const isUnique = (
          Boolean(uniqueSchemaItem) &&
          (workspaceState?.getItemsByType(type).length || 0) > 0
        );
        return !isUnique;
      });

      if (!workspaceState?.getSchemaItemAt(index) && additionalSchema) {
        const additionalSchemaWithInitialValues = additionalSchema.map((item) => ({ ...item, ...COMMON_INITIAL_VALUES }));
        workspaceState?.setSchema(union(workspaceState.getSchema(), additionalSchemaWithInitialValues as FBSchemaProps[]));
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
      const {
        options,
        validators,
        label,
        editorProperties,
        uniqueSchemaItem,
        placeholder,
        validationAttribute,
        rules,
        defaultValue,
        editorConfig,
      } = formValues;

      // If schema item type is unique and we have already added it into scheme
      const isUnique = (
        uniqueSchemaItem &&
        (workspaceState?.getItemsByType(type).length || 0) > 0
      );
      let formRules = validators && toStringRules?.(validators);

      // Inidvidual field flag setup
      if (type === "eqmaintenance") {
        const eqRules = [formRules, "eq_maintenance_required"];
        formRules = compact(eqRules).join(",");
      }
      if (type === "blanktplform" && !defaultValue) {
        formValues.defaultValue = [];
      }
      if (type === "mpiprocedure"  && (!editorConfig || isEmpty(editorConfig))) {
        formValues.editorConfig = {
          attachments: [],
          description: "",
          equipment: [],
          materials: [],
        };
      }
      if (type === "lhrstep" && !editorConfig) {
        formValues.editorConfig = {};
      }

      if (isUnique && !formValues.name) { return dialogState?.closeDialog(); }

      if (isOutput && !workspaceState?.isMode("formDesign")) {
        handleAddOutput(formValues);
        return;
      }
      additionalSchema();
      formValues.rules = formRules || rules;

      workspaceState?.setSchemaItemAt({
        index,
        type,
        name: `${kebabCase(label as string)}-${FB.uniqid}`,
        ...omit(formValues, editorPropertiesFlags),
        ...isString(options) && stringToOptions && { options: stringToOptions(options, editorProperties) },
        applicableOn: ["ON_STATE_TO_IN_REVIEW"],
        applicableValidationSchema: true,
        validationAttribute: (label as string) || placeholder || validationAttribute,
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
