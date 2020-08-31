import { find, map } from "lodash";
import React from "react";
import { FB, FBActionFieldActions, FBActionFieldProps, FBActionOptionProps, FBData, FBDialogState, FBForm } from "..";

export const withFBActionField = <T extends FBActionFieldProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAction,
    dialogState,
    actions,
    options,
    disabled,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options = map(actions, (actionName) => find(FBData.actionOptions, { name: actionName })!);
    disabled = disabled || !workspaceState?.id;

    handleAction = (option: FBActionOptionProps) => {
      const { schema, requestUrl } = option;
      dialogState?.config({
        open: true,
        content: <FBForm initialValues={{ "documentRevision.id": workspaceState?.id }} {...{ schema }} />,
        actions: <FBActionFieldActions {...{ requestUrl }} />,
      });
    };

    return Component({
      ...(props as T),
      handleAction,
      dialogState,
      options,
      disabled,
    });
  };

  return (props: T) => Comp(props);
};
