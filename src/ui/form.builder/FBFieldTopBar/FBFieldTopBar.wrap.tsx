import { isEmpty } from "lodash";
import React from "react";
import { FBFieldTopBarProps } from ".";
import { FB } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";
import { FBSchemaProps } from "../FBSchema";

export const withFBFieldTopBar = <T extends FBFieldTopBarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    openEditor,
    inputProps,
    inputProps: { type } = {},
    ...props
  }: T) => {

    const { fieldWrapperState, workspaceState } = FB.useStores();
    const { documentId } = workspaceState || {};

    const editSchemaItem = () => {
      openEditor && type && openEditor(inputProps)();
    };

    const removeSchemaItem = () => {
      const { name = "", rules = "" } = inputProps || {};
      if (hasValidationRelation(name, rules)) { return; }
      if (documentId && !isEmpty(documentId)) {
        inputProps = { ...inputProps, deleted: true };
      }
      workspaceState?.removeSchemaItem(inputProps);
    };

    const markDownSchemaItem = () =>
      fieldWrapperState?.setMarkDownActive(!fieldWrapperState.markDownVisible);

    // MARK: @helpers
    function hasValidationRelation(fieldName: string, fieldRules: string): Boolean {
      const scheme = workspaceState?.getSchema() || [];
      var relatedValidationItem: FBSchemaProps | undefined;
      for(const schemeItem of scheme) {
        const { name, rules = "" } = schemeItem || {};
        if (name && name !== fieldName && (rules.includes(fieldName) || fieldRules.includes(name))) {
          relatedValidationItem = schemeItem;
          break;
        }
      }
      if (relatedValidationItem) {
        const relatedValidationLabel = (
          relatedValidationItem.label ||
          relatedValidationItem.placeholder ||
          relatedValidationItem.name
        )
        // TODO: Check for copy and do translation
        alert( `Field can't be removed because it has validation relation with the field: ${relatedValidationLabel}!`);
        return true;
      }
      return false;
    }

    return Component({
      ...(props as T),
      editSchemaItem,
      removeSchemaItem,
      markDownSchemaItem,
      inputProps,
    });
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
