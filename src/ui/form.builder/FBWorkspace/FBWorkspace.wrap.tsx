
import { useObserver } from "mobx-react";
import React from "react";
import { FBWorkspaceProps, FBWorkspaceState } from ".";
import { FB } from "..";
import { FBDialogState } from "../FBDialog";

export const withFBWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    workspaceState,
    dialogState,
    schema,
    mode,
    ...props
  }: T) => {

    workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    React.useEffect(() => {
      workspaceState && mode && (workspaceState.setMode(mode));
    }, [mode, workspaceState]);

    return useObserver(() => Component({
      ...(props as T),
      isStarter: workspaceState?.isStarter,
      active: workspaceState?.active,
      schema: workspaceState?.schema,
      mode: workspaceState?.mode,
      initialValues: workspaceState?.initialValues,
      dialogState,
      workspaceState,
    }));
  };

  return (props: T) => Comp(props);
};
