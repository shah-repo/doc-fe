import { isEmpty, isObject } from "lodash";
import React from "react";
import { FB, FBFieldTopBarProps, FBSchemaProps } from "..";
import { toastError } from "../../components/notifications";
import { checkIsDocumentForm } from "../../documentRevision/helpers/checkDocumentGroup";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";

export const withFBFieldTopBar = <T extends FBFieldTopBarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    openEditor,
    inputProps,
    inputProps: { type } = {},
    ...props
  }: T) => {

    const { fieldWrapperState, workspaceState, bookmarkState } = FB.useStores();
    const { documentId, document } = workspaceState || {};
    const { documentType } = document?.document || {};
    const isDocumentForm = checkIsDocumentForm(documentType?.groupOptions);
    const { deleteDisabled, deleteInFormDisabled } = inputProps || {};
    inputProps = {
      ...inputProps,
      deleteDisabled: (isDocumentForm && deleteInFormDisabled) || (!isDocumentForm && deleteDisabled),
    };

    const editSchemaItem = () => {
      openEditor && type && openEditor(inputProps)();
    };

    const removeSchemaItem = () => {
      const { name = "", rules = "" } = inputProps || {};
      if (hasValidationRelation(name, rules)) { return; }
      if (documentId && !isEmpty(documentId)) {
        inputProps = { ...inputProps, deleted: true };
        workspaceState?.setSchemaItem(inputProps);
        return;
      }
      if (inputProps?.type === "section") {
        bookmarkState?.removeBookmark(inputProps?.name as string);
      }
      workspaceState?.removeSchemaItem(inputProps);
    };

    const markDownSchemaItem = () =>
      fieldWrapperState?.setMarkDownActive(!fieldWrapperState.markDownVisible);

    // MARK: @helpers
    function hasValidationRelation(fieldName: string, fieldRules: string): boolean {
      const scheme = workspaceState?.getSchema() || [];
      let relatedValidationItem: FBSchemaProps | undefined;
      for (const schemeItem of scheme) {
        const { name } = schemeItem || {};
        let { rules = "" } = schemeItem || {};
        if (isObject(rules)) {
          rules = JSON.stringify(rules);
        }
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
        );
        // TODO: Check for copy and do translation
        // eslint-disable-next-line max-len
        toastError( `Field can't be removed because it has validation relation with the field: ${relatedValidationLabel}!`);
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
