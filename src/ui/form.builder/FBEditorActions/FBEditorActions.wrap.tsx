import _, { Dictionary } from "lodash";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FB } from "..";
import { FBData } from "../FBData";
import { withFBValidation } from "../FBValidation/FBValidation.wrap";
import { FBOptionProps } from "../types/common";

export const withFBEditorActions = <T extends FBEditorActionsProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    onAddClick,
    onCancelClick,
    toStringRules,
    index,
    type,
    ...props
  }: T) => {

    const { dialogState, workspaceState, formState } = FB.useStores();

    function editorProperties(formValues?: Dictionary<any>): Dictionary<boolean> | undefined {
      if (!formValues) {
        return;
      }
      return Object.assign({}, ..._.map(formValues.editorProperties, (value) => ({
        [value]: true,
      })));
    }

    function propertiesOptions(formValues?: Dictionary<any>): FBOptionProps[] | undefined {
      if (formValues?.options && formValues.editorProperties && type) {
        _.map(FBData.editorProperties[type], (ep) => {
          if (_.includes(formValues.editorProperties, ep.value)) {
            const propOption = { ...ep, text: ep.outputText };
            ep.value === "includeNone"
              ? formValues.options[0] = propOption
              : formValues.options.push(propOption);
          }
        });
      }
      return formValues?.options;
    }

    onAddClick = () => {
      const formValues = formState?.getValues();
      const options = propertiesOptions(formValues);
      workspaceState?.setSchemaItemAt({
        index,
        type,
        name: FB.uniqid,
        ...formValues,
        ...formValues?.validators && toStringRules && { rules: toStringRules(formValues.validators) },
        ...editorProperties(formValues),
        ...options && { options },
      }, index);
      dialogState?.closeDialog();
    };

    onCancelClick = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      onAddClick,
      onCancelClick,
      type,
    });
  };

  return withFBValidation((props: T) => Comp(props));
};
