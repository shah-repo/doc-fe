import React from "react";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderItem } from "..";

export const withFBPurchaseOrderActions = <T extends FBPurchaseOrderActionsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onAddClick,
    onCancelClick,
    ...props
  }: T) => {

    const { purchaseOrderState, dialogState, formState } = FB.useStores();

    onAddClick = () => {
      const values = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setItem(values);
      dialogState?.closeDialog();
    };

    onCancelClick = () => {
      dialogState?.closeDialog();
      purchaseOrderState?.setItemTotalAmount();
    };

    return Component({
      ...(props as T),
      onAddClick,
      onCancelClick,
      purchaseOrderState,
    });
  };

  return (props: T) => Comp(props);
};
