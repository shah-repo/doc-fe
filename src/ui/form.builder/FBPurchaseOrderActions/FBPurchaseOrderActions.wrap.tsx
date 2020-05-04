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

    useObserver(() => {
      totalPrice = purchaseOrderState?.totalAmount || 0;
    });

    return Component({
      ...(props as T),
      onAddClick,
      onCancelClick: dialogState?.closeDialog,
      totalPrice,
    });
  };

  return (props: T) => Comp(props);
};
