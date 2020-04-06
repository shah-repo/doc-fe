import React from "react";
import { FB } from "../..";
import { FBPurchaseOrderFormProps } from "../FBPurchaseOrder.types";

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
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
      name,
      items: poState.po.items,
    });
  };

  return (props: T) => Comp(props);
};
