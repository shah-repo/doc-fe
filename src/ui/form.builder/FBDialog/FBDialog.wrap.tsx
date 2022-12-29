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
    classes,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();
    const { workspaceState } = FB.useStores();
    const handleClose = () => {
      workspaceState?.setIsPreview(false);
      if (dialogState?.props?.onClose) {
        dialogState?.props?.onClose?.();
        return;
      }
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
      classes = dialogState?.classes;
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
      classes,
      actions,
    });
  };

  return (props: T) => Comp(props);
};
