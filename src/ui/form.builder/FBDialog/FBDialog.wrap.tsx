import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogProps } from "..";

export const withFBDialog = <T extends FBDialogProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    maxWidth = "sm",
    content,
    title,
    actions,
    open,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();
    const handleClose = () => {
      dialogState?.props?.onClose?.();
      dialogState?.closeDialog();
    };

    const [portalAction, setActionContainer] = React.useState(null);
    const handleActionsRef = React.useCallback((instance) => {
      setActionContainer(instance);
    }, [setActionContainer]);

    const [portalTitle, setTitleContainer] = React.useState(null);
    const handleTitleRef = React.useCallback((instance) => {
      setTitleContainer(instance);
    }, [setTitleContainer]);

    useObserver(() => {
      open = dialogState?.open;
      content = dialogState?.content;
      title = dialogState?.title;
      maxWidth = dialogState?.maxWidth || "sm";
      actions = dialogState?.actions;
    });

    return Component({
      ...(props as T),
      handleActionsRef,
      handleTitleRef,
      handleClose,
      dialogState,
      portalAction,
      portalTitle,
      open,
      content,
      title,
      maxWidth,
      actions,
    });
  };

  return (props: T) => Comp(props);
};
