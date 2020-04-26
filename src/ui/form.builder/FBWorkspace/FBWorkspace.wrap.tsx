
import { useObserver } from "mobx-react";
import React from "react";
import { FBWorkspaceProps, FBWorkspaceState } from ".";
import { FB, FBSchemaProps } from "..";
import { FBDialogState } from "../FBDialog";
import FBStore from "../stores/ui/FBStore";

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
    initialValues,
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
      initialValues = workspaceState?.initialValues;
    });

    return Component({
      ...(props as T),
      isStarter,
      active,
      schema,
      mode,
      initialValues,
      dialogState,
      workspaceState,
    });
  };

  return (props: T) => Comp(props);
};
