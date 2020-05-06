
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBPOReceiveForm, FBPOReceiveFormActions, FBPOReceiveTableProps } from "..";

export const withFBPOReceiveTable = <T extends FBPOReceiveTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleEdit,
    name,
    receivedItems = {},
    ...props
  }: T) => {

    const { dialogState, poReceiveState } = FB.useStores();

    handleEdit = (_index, item) => () => {
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.po.items.received",
        content: <FBPOReceiveForm />,
        actions: <FBPOReceiveFormActions {...{ item }} />,
      });
    };

    useObserver(() => {
      receivedItems = poReceiveState?.receivedItems.data;
    });

    return Component({
      ...(props as T),
      handleEdit,
      receivedItems,
    });
  };

  return (props: T) => Comp(props);
};
