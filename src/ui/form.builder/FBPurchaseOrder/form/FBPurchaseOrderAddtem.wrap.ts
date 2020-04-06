import React from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";

export const withFBPurchaseOrderAddItem = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const { poState } = FB.useStores();
    const dialog = useDialog();
    const openDialog = () => {
      if (props.disabled) {
        return;
      }

      dialog.open();
    };
    const closeDialog = () => {
      dialog.close();
      poState.clearFormValues();
    };
    const onSubmit = (item) => {
      dialog.close();
      poState.addItem(item);
      poState.clearFormValues();
    };

    return Component({
      ...(props),
      poState,
      openDialog,
      closeDialog,
      isDialogOpen: dialog.isOpen,
      onSubmit,
      items: poState.po.items,
    });
  };

  return (props: T) => Comp(props);
};
