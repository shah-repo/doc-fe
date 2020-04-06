import React from "react";
import { FBPurchaseOrderDialogProps } from "../FBPurchaseOrder.types";

export const withFBPurchaseOrderDialog = <T extends FBPurchaseOrderDialogProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    ...props
  }: T) => Component({
    ...(props as T),
    name,
  });

  return (props: T) => Comp(props);
};
