/* eslint-disable max-len */
import { compact, Dictionary, filter, isEmpty, isString, kebabCase, omit, size, union } from "lodash";
import React from "react";
import { editorPropertiesFlags, FB, FBData, FBEditorActionsProps, FBSchemaProps } from "..";
import { SM } from "../../../App";
import { withFBEditorOptions } from "../FBEditorOptions/FBEditorOptions.wrap";
import { COMMON_INITIAL_VALUES } from "../FBInput/FBInput.wrap";
import { withFBValidation } from "../FBValidation/FBValidation.wrap";
import { EQMaintenanceRequired } from "./constants";

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

    const { dialogState, workspaceState, formState, leftPanelState } = FB.useStores();
    const { _tabsState } = SM.useStores();
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

      if ((!workspaceState?.getSchemaItemAt(index) || index === 0) && additionalSchema) {
        const additionalSchemaWithInitialValues = additionalSchema.map((item) => ({ ...item, ...COMMON_INITIAL_VALUES, tabId: _tabsState?.tabID }));
        workspaceState?.setSchema(union(workspaceState.getSchema(), additionalSchemaWithInitialValues as FBSchemaProps[]));
        index = index + size(additionalSchema);
      }
    }

    function handleAddOutput(formValues: FBSchemaProps) {
      const { name } = formValues;
      parentFormState?.setFieldValue(name, formValues, true);
      dialogState?.closeDialog();
    }

    function setDefaultValue(formValues?: Dictionary<any>): Dictionary<any> {
      return {
        ...COMMON_INITIAL_VALUES,
        ...formValues,
      };
    }

    handleAdd = () => {
      if (!type) { return; }
      const formValues: FBSchemaProps = setDefaultValue(formState?.getValues()) as FBSchemaProps;
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
      let formRules = rules;
      if (validators) {
        formRules = toStringRules?.(validators);
      }

      // Inidvidual field flag setup
      if (type === "eqmaintenance" && !formRules?.includes(EQMaintenanceRequired)) {
        formRules = compact([formRules, EQMaintenanceRequired]).join(",");
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
      // Have to set editorProperties here so it doesn't override manually set values
      if (!editorProperties) {
        formValues.editorProperties = COMMON_INITIAL_VALUES.editorProperties;
      }

      if (isUnique && !formValues.name) { return dialogState?.closeDialog(); }

      if (isOutput && !workspaceState?.isMode("formDesign")) {
        handleAddOutput(formValues);
        return;
      }
      additionalSchema();
      formValues.rules = formRules;

      workspaceState?.setSchemaItemAt({
        index,
        type,
        name: `${kebabCase(label as string)}-${FB.uniqid}`,
        ...omit(formValues, editorPropertiesFlags),
        ...isString(options) && stringToOptions && { options: stringToOptions(options, editorProperties) },
        applicableOn: ["ON_STATE_TO_IN_REVIEW"],
        applicableValidationSchema: true,
        validationAttribute: (label as string) || placeholder || validationAttribute,
        tabId: _tabsState?.tabID,
      }, index);
      leftPanelState?.setIndex(index + 1 || 0);

      dialogState?.closeDialog();
      leftPanelState?.HideLeftPanel();
    };

    handleCancel = () => {
      dialogState?.closeDialog();
      leftPanelState?.HideLeftPanel();
    };

    return Component({
      ...(props as T),
      handleAdd,
      handleCancel,
      type,
    });
  };

  return withFBEditorOptions(withFBValidation((props: T) => Comp(props)));
};
