import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FBPurchaseOrderState } from ".";
import { FB } from "..";

export const withFBPurchaseOrder = <T extends any>(
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

    useObserver(() => {
      poState.isDialogOpen = poState?.isDialogOpen;
    });

    return Component({
      ...(props as T),
      poState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
