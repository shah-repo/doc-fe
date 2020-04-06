import React, { useEffect } from "react";
import { FBPurchaseOrderState } from ".";
import { FB } from "..";
import { FBPurchaseOrderFieldProps } from "./FBPurchaseOrder.types";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderFieldProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    poState,
    name = "",
    ...props
  }: T) => {

    poState = FB.useRef<FBPurchaseOrderState>(FBPurchaseOrderState);

    useEffect(() => {
      poState.name = name;
      poState.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return Component({
      ...(props as T),
      poState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
