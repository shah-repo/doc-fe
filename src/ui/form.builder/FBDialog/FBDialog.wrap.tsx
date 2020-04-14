
import { useObserver } from "mobx-react";
import React from "react";
import { FBDialogProps } from ".";
import { FB } from "..";

export const withFBDialog = <T extends FBDialogProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    content,
    title,
    maxWidth = "sm",
    actions,
    open,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    React.useEffect(() => {
      dialogState && dialogState.config({ maxWidth, content, title, actions });
    }, []);

    const onCloseClick = () => dialogState?.closeDialog();

    useObserver(() => {
      open = dialogState?.open;
      content = dialogState?.content;
      title = dialogState?.title;
      maxWidth = dialogState?.maxWidth || "sm";
      actions = dialogState?.actions;
    });

    return Component({
      ...(props as T),
      open,
      content,
      title,
      maxWidth,
      actions,
      onCloseClick,
    });
  };

  return (props: T) => Comp(props);
};
