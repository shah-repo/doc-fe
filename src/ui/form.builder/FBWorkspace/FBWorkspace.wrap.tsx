
import { differenceBy, filter, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FB, FBDialogState, FBInlineApprovalBody, FBSchemaProps, FBSectionTypes, FBSnackbarState, FBWorkspaceProps, FBWorkspaceState } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
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
    autosave = false,
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
    const dispatch = useDispatch();

    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    snackbarState = FB.useRef<FBSnackbarState>(FBSnackbarState);
    workspaceState && (workspaceState.document = document);
    const { formInput = {} } = document ?? {};
    workspaceState.formInput = formInput;

    React.useEffect(() => {
      map(formInput, (value, key) => {
        workspaceState?.setFormInputSync(key, value);
      });
    }, [formInput, workspaceState]);

    const { groupOptions: formGroupOptions } = document?.document?.documentType || {};
    // We should include document type in FB
    // We can't ignore that FB is not standalone package anymore
    const { parent } = document || {};
    includeProcedureDiff = (
      checkIsDocumentEB(formGroupOptions) &&
      Boolean(parent)
    );

    React.useEffect(() => {
      reaction(
        () => workspaceState?.loadAudit,
        (state) => {
          if (!state) { return; }
          const { id } = workspaceState || {};
          if (!id) { return; }
          dispatch(documentRevisionsActions.loadAudit(id));
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.setAutosave(autosave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autosave]);

    // *TODO: find a way to reset constructor props
    useEffect(() => {
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

    useEffect(() => reaction(
      () => workspaceState?.schema,
      () => {
        const canAddFBFields = workspaceState?.mode === "design" || workspaceState?.mode === "formDesign";
        if (!canAddFBFields) { return; }
        workspaceState?.saveDocRev();
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

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
