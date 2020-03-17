
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
    ...props
  }: T) => {

    const { dialog } = FB.useStores();

    React.useEffect(() => {
      dialog && dialog.config({maxWidth, content, title, actions});
    }, []);

    const onCloseClick = () => dialog.closeDialog();

    return useObserver(() => Component({
      ...(props as T),
      open: dialog?.open,
      content: dialog?.content,
      title: dialog?.title,
      maxWidth: dialog?.maxWidth,
      actions: dialog?.actions,
      onCloseClick,
    }));
  };

  return (props: T) => Comp(props);
};
