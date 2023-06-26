import React from 'react';
import { FB, FBActionFieldActionsProps, FBActionFieldState } from '..';

export const withFBActionFieldActions = <T extends FBActionFieldActionsProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    handleRequest,
    handleCancel,
    actionFieldState,
    requestUrl,
    ...props
  }: T) => {

    const { dialogState, formState } = FB.useStores();
    actionFieldState = FB.useRef<FBActionFieldState>(FBActionFieldState, requestUrl);

    handleRequest = () => {
      if (!requestUrl) { return; }
      const formValues = formState?.getValues();
      actionFieldState?.setBody(formValues);
      actionFieldState?.post();
      dialogState?.closeDialog();
    };

    handleCancel = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      handleRequest,
      handleCancel,
    });
  };

  return (props: T) => Comp(props);
};
