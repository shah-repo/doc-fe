
import React from "react";
import { FB, FBPOReceiveForm, FBPOReceiveFormActions, FBPOReceiveTableProps } from "..";

export const withFBPOReceiveTable = <T extends FBPOReceiveTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleEdit,
    name,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    handleEdit = (_index, item) => () => {
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.po.items.received",
        content: <FBPOReceiveForm />,
        actions: <FBPOReceiveFormActions {...{ item }} />,
      });
    };

    return Component({
      ...(props as T),
      handleEdit,
    });
  };

  return (props: T) => Comp(props);
};
