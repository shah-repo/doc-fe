import React from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";

export const withFBPurchaseOrderTable = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    ...props
  }: T) => {
    const { poState } = FB.useStores();
    const dialog = useDialog();
    const handleEdit = (index) => () => {
      if (props.disabled) {
        return;
      }
      poState.setFormValues(poState.po.items[index]);
      dialog.open();
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
      isDialogOpen: dialog.isOpen,
      closeDialog: dialog.close,
    });
  };

  return (props: T) => Comp(props);
};
