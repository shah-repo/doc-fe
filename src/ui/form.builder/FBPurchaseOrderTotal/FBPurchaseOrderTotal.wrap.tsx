import React from "react";
import { FBPurchaseOrderTotalProps } from "..";

export const withFBPurchaseOrderTotal = <T extends FBPurchaseOrderTotalProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    console.log(props);

    return Component({
      ...(props),
    });
  };

  return (props: T) => Comp(props);
};
