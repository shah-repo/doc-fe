
import { differenceBy, filter, map } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBInlineApprovalBody, FBSchemaProps, FBSectionTypes, FBSnackbarState, FBWorkspaceProps, FBWorkspaceState } from "..";
import { store } from "../../../state/store";
import { checkIsDocumentEB } from "../../documentRevision/helpers/checkDocumentGroup";

// Disable missing translation message for the non translation cases.

// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (message, ...args) => {
  if (
    typeof message === "string" &&
    (message.startsWith("[React Intl] Cannot format message:") || message.startsWith("[React Intl] Missing message:"))
  ) {
    return;
  }
  consoleError(message, ...args);
};

export const withFBWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    workspaceState,
    dialogState,
    snackbarState,
    mode,
    isStarter,
    active,
    document,
    changeRequest,
    autosave,
    schema,
    includeProcedureDiff,
    ...props
  }: T) => {

    const { bookmarkState } = FB.useStores();
    let workspaceSchema: FBSchemaProps[] = [];
    workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, {
      schema,
      mode,
      autosave,
    });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    snackbarState = FB.useRef<FBSnackbarState>(FBSnackbarState);
    workspaceState && (workspaceState.document = document);
    const { groupOptions: formGroupOptions } = document?.document?.documentType || {};
    // We should include document type in FB
    // We can't ignore that FB is not standalone package anymore
    const { parent } = document || {};
    includeProcedureDiff = (
      checkIsDocumentEB(formGroupOptions) &&
      Boolean(parent)
    );

    React.useEffect(() => {
      const schemaDiff = differenceBy(workspaceState?.schema, schema || [], "name");
      const sections = filter(schemaDiff, (schemaItem) =>
        schemaItem.type && FBSectionTypes.includes(schemaItem.type));
      bookmarkState?.removeBookmarks(map(sections, "name"));
      workspaceState && (workspaceState.schema = schema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schema, workspaceState]);

    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.approvals = document?.approvals as FBInlineApprovalBody[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document?.approvals]);

    // *TODO: find a way to reset constructor props
    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.changeRequest = changeRequest;
      workspaceState.externalState = store.getState();
    }, [workspaceState, changeRequest]);

    useObserver(() => {
      isStarter = workspaceState?.isStarter;
      active = workspaceState?.active;
      workspaceSchema = workspaceState?.schema || [];
      mode = workspaceState?.mode;
    });

    return Component({
      ...(props as T),
      isStarter,
      active,
      schema: workspaceSchema,
      mode,
      dialogState,
      workspaceState,
      snackbarState,
      autosave,
      includeProcedureDiff,
    });
  };

  return (props: T) => Comp(props);
};
