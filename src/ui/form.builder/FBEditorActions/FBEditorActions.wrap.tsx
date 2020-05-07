import _, { Dictionary } from "lodash";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FB } from "..";
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

    // function propertiesOptions(formValues?: Dictionary<any>): FBOptionProps[] | undefined {
    //   if (formValues?.options && formValues.editorProperties && type) {
    //     _.map(FBData.editorProperties[type], (ep) => {
    //       if (_.includes(formValues.editorProperties, ep.value)) {
    //         const propOption = { ...ep, text: ep.outputText };
    //         ep.value === "includeNone"
    //           ? formValues.options[0] = propOption
    //           : formValues.options.push(propOption);
    //       }
    //     });
    //   }
    //   return formValues?.options;
    // }

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

    onAddClick = () => {
      const formValues = formState?.getValues();
      const options = editorOptions(formValues);
      workspaceState?.setSchemaItemAt({
        index,
        type,
        name: `${_.kebabCase(formValues?.label)}-${FB.uniqid}`,
        ...formValues,
        ...options && { options },
        ...formValues?.validators && toStringRules && { rules: toStringRules(formValues.validators) },
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
