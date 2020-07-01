import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderItem } from "..";

export const withFBPurchaseOrderActions = <T extends FBPurchaseOrderActionsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onAddClick,
    onCancelClick,
    totalPrice,
    ...props
  }: T) => {

    const { purchaseOrderState, dialogState, formState } = FB.useStores();

    onAddClick = () => {
      purchaseOrderState?.setItem(formState?.getValues() as FBPurchaseOrderItem);
      dialogState?.closeDialog();
    };

    onCancelClick = () => {
      dialogState?.closeDialog();
      purchaseOrderState?.setItemTotalAmount();
    };

    useObserver(() => {
      totalPrice = purchaseOrderState?.itemTotalAmount || 0;
    });

    return Component({
      ...(props as T),
      onAddClick,
      onCancelClick,
      totalPrice,
      currency: purchaseOrderState?.calculation.currency,
    });
  };

  return (props: T) => Comp(props);
};
