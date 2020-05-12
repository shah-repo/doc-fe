import { debounce } from "lodash";
import React, { useEffect } from "react";
import { FBPurchaseOrderState } from ".";
import { FB } from "..";
import FBStore from "../stores/ui/FBStore";
import { FBPurchaseOrderFieldProps } from "./FBPurchaseOrder.types";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const debounced = debounce((f) => {
    f();
  }, 300);
  const Comp = ({
    poState,
    name = "",
    ...props
  }: T) => {

    poState = FB.useRef<FBPurchaseOrderState>(FBPurchaseOrderState);

    useEffect(() => {
      debounced(() => {
        poState.name = name;
        poState.initialize();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    useEffect(() => {
      poState?.fetchReceivedItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FBStore.document.id]);

    return Component({
      ...(props as T),
      poState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
