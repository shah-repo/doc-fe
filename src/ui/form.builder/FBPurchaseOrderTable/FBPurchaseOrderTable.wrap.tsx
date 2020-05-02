import React from "react";
import { FBPurchaseOrderTableProps } from "..";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
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
