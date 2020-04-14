import React from "react";
import { FB } from "../..";
import { FBPurchaseOrderTotalProps } from "../FBPurchaseOrder.types";

export const withFBPurchaseOrderTotal = <T extends FBPurchaseOrderTotalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    ...props
  }: T) => {
    const { poState } = FB.useStores();

    return Component({
      ...(props as T),
      poState,
      setShippingCost: poState?.setShippingCost,
      subTotal: poState?.po.subTotal,
      tax: poState?.po.tax,
      totalAmount: poState?.po.totalAmount,
      shippingCost: poState?.po.shippingCost,
      name,
    });
  };

  return (props: T) => Comp(props);
};
