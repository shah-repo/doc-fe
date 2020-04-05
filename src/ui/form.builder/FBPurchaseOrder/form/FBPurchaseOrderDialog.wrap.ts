import React from "react";
import { FB } from "../..";

export const withFBPurchaseOrderDialog = <T extends any>(
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
    });
  };

  return (props: T) => Comp(props);
};
