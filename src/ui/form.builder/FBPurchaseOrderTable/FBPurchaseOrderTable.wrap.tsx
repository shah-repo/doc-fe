import { useObserver } from "mobx-react";
import React from "react";
import { FBPurchaseOrderClasses } from ".";
import { FB, FBPurchaseOrderTableProps } from "..";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCost,
    classes,
    calculation,
    items,
    ...props
  }: T) => {

    const { purchaseOrderState } = FB.useStores();
    classes = FBPurchaseOrderClasses();

    handleShippingCost = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      purchaseOrderState?.setShippingCost(value);
    };

    useObserver(() => {
      calculation = purchaseOrderState?.calculation;
      items = purchaseOrderState?.items;
    });

    return Component({
      ...(props as T),
      handleShippingCost,
      classes,
      calculation,
      items,
    });
  };

  return (props: T) => Comp(props);
};
