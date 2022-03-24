import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogProps } from "..";

export const withFBLeftPanel = <T extends FBDialogProps>(
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

    const { leftPanelState } = FB.useStores();
    const handleClose = () => {
      if (leftPanelState?.props?.onClose) {
        leftPanelState?.props?.onClose?.();
        return;
      }
      leftPanelState?.closeDialog();
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
      open = leftPanelState?.open;
      content = leftPanelState?.content;
      title = leftPanelState?.title;
      maxWidth = leftPanelState?.maxWidth || "sm";
      actions = leftPanelState?.actions;
    });

    return Component({
      ...(props as T),
      handleActionsRef,
      handleTitleRef,
      handleClose,
      leftPanelState,
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
