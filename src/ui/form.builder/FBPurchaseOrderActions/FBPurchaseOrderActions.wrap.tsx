import React from "react";
import { FBPurchaseOrderActionsProps } from "..";

export const withFBPurchaseOrderActions = <T extends FBPurchaseOrderActionsProps>(
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
