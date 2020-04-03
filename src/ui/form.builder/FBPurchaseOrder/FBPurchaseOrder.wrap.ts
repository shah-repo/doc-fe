import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FBPurchaseOrderState } from ".";
import { FB } from "..";
import FBStore from "../stores/ui/FBStore";

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
      poState.po = FBStore.getValue(name);
      poState.name = name;
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
