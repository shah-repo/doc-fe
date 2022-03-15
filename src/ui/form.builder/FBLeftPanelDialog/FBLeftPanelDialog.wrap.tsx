import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogProps } from "..";

export const withFBLeftPanelDialog = <T extends FBDialogProps>(
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

    const { leftPanelDialogState } = FB.useStores();
    const handleClose = () => {
      if (leftPanelDialogState?.props?.onClose) {
        leftPanelDialogState?.props?.onClose?.();
        return;
      }
      leftPanelDialogState?.closeDialog();
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
      open = leftPanelDialogState?.open;
      content = leftPanelDialogState?.content;
      title = leftPanelDialogState?.title;
      maxWidth = leftPanelDialogState?.maxWidth || "sm";
      actions = leftPanelDialogState?.actions;
    });

    return Component({
      ...(props as T),
      handleActionsRef,
      handleTitleRef,
      handleClose,
      leftPanelDialogState,
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
