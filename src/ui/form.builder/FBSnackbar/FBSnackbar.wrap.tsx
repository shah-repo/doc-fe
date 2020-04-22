import { useObserver } from "mobx-react";
import React from "react";
import { FBSnackbarProps } from ".";
import { FB } from "..";

export const withFBSnackbar = <T extends FBSnackbarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    anchorOrigin,
    message,
    onClose,
    action,
    open,
    ...props
  }: T) => {

    const { snackbarState } = FB.useStores();

    useObserver(() => {
      open = snackbarState?.open;
      anchorOrigin = snackbarState?.anchorOrigin;
      action = snackbarState?.action;
      message = snackbarState?.message;
    });

    return Component({
      ...(props as T),
      onClose,
      anchorOrigin,
      message,
      action,
      open,
    });
  };

  return (props: T) => Comp(props);
};
