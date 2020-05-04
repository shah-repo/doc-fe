
import { useObserver } from "mobx-react";
import React from "react";
import { FBWorkspaceProps, FBWorkspaceState } from ".";
import { FB, FBSchemaProps } from "..";
import { FBDialogState } from "../FBDialog";
import FBStore from "../stores/ui/FBStore";

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
    schema,
    mode,
    isStarter,
    active,
    // OLD: to be removed
    id = "",
    documentId = "",
    document = {},
    ...props
  }: T) => {

    workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, {
      schema: FBStore.getSchema() as FBSchemaProps[],
      mode: FBStore.mode,
    });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    React.useEffect(() => {
      // workspaceState && mode && (workspaceState.setMode(mode));
      // OLD: to be removed
      FBStore.docId = id;
      FBStore.documentId = documentId;
      FBStore.document = document;
      // workspaceState?.setSchema(FBStore.getSchema() as FBSchemaProps[]);
    }, []);

    useObserver(() => {
      isStarter = workspaceState?.isStarter;
      active = workspaceState?.active;
      schema = workspaceState?.schema;
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
    });
  };

  return (props: T) => Comp(props);
};
