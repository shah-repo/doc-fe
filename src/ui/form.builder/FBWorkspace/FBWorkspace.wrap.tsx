
import { uniqBy } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBWorkspaceProps, FBWorkspaceState } from ".";
import { FB, FBSchemaProps, FBSnackbarState } from "..";
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
    autosave,
    ...props
  }: T) => {
    let schema: FBSchemaProps[] = [];
    workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, { schema: props.schema, mode, autosave, document });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    snackbarState = FB.useRef<FBSnackbarState>(FBSnackbarState);


    // *TODO: find a way to reset constructor props
    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.document = document;
      if (!props.schema) { return; }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      workspaceState.schema = uniqBy([...props.schema!, ...workspaceState.schema || []], "name");
    }, [workspaceState, props.schema, document]);


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
