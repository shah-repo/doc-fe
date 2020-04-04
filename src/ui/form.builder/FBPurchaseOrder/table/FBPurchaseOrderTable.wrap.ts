import React from "react";
import { FB } from "../..";

export const withFBPurchaseOrderTable = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    ...props
  }: T) => {
    const { poState } = FB.useStores();
    const handleEdit = (index) => () => {
      if (props.disabled) {
        return;
      }
      poState.setFormValues(poState.po.items[index]);
      poState.openDialog();
    };
    const handleDelete = (index) => (e) => {
      e.stopPropagation();
      !props.disabled && poState.deleteItem(index);
    };

    return Component({
      ...(props as T),
      poState,
      name,
      handleEdit,
      handleDelete,
    });
  };

  return (props: T) => Comp(props);
};
