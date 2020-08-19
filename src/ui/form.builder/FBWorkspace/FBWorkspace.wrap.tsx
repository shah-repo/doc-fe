
import { union, uniqBy } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBWorkspaceProps, FBWorkspaceState } from ".";
import { FB, FBSchemaProps, FBSnackbarState } from "..";
import { store } from "../../../state/store";
import { FBDialogState } from "../FBDialog";

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
    ...props
  }: T) => {
    let schema: FBSchemaProps[] = [];
    workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, {
      schema: props.schema,
      mode,
      autosave,
    });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    snackbarState = FB.useRef<FBSnackbarState>(FBSnackbarState);

    // predefined schema hack until we remove formik from rest of the project
    if (workspaceState) {
      const originType = document?.document?.documentType;
      const workspaceType = workspaceState.document?.document?.documentType;
      if (originType !== workspaceType) {
        workspaceState.schema = props.schema || [];
      } else {
        workspaceState.schema = uniqBy(union(workspaceState.schema, props.schema || []), "name");
      }
      workspaceState.document = document;
    }
    // *TODO: find a way to reset constructor props
    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.changeRequest = changeRequest;
      workspaceState.externalState = store.getState();
    }, [workspaceState, changeRequest]);

    useObserver(() => {
      isStarter = workspaceState?.isStarter;
      active = workspaceState?.active;
      schema = workspaceState?.schema || [];
      mode = workspaceState?.mode;
    });

    return Component({
      ...(props as T),
      isStarter,
      active,
      schema,
      mode,
      dialogState,
      workspaceState,
      snackbarState,
      autosave,
    });
  };

  return (props: T) => Comp(props);
};
