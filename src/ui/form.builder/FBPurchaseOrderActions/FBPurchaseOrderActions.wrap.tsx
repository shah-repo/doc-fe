import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBPurchaseOrderActionsProps } from "..";

export const withFBPurchaseOrderActions = <T extends FBPurchaseOrderActionsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    totalPrice,
    ...props
  }: T) => {

    const { purchaseOrderState } = FB.useStores();

    useObserver(() => {
      totalPrice = purchaseOrderState?.totalPrice || 0;
    });

    return Component({
      ...(props as T),
      totalPrice,
    });
  };

  return (props: T) => Comp(props);
};
