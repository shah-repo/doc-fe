import _ from "lodash";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FB } from "..";
import { withFBValidation } from "../FBValidation/FBValidation.wrap";

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

    onAddClick = () => {
      const formValues = formState?.getValues();
      const editorProps = Object.assign({}, ..._.map(formValues?.editorProperties, (value) => ({ [value]: true })));
      workspaceState?.setSchemaItemAt({
        index,
        ...formValues,
        name: formValues?.name || FB.uniqid,
        ...formValues?.validators && toStringRules && { rules: toStringRules(formValues.validators) },
        ...editorProps,
        type,
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
