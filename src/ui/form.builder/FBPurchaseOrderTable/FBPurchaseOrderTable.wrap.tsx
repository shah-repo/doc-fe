import { useObserver } from "mobx-react";
import React from "react";
import { FBPurchaseOrderClasses } from ".";
import { FB, FBPurchaseOrderTableProps } from "..";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCost,
    handleDelete,
    classes,
    calculation,
    disabled,
    items,
    name,
    ...props
  }: T) => {

    const { purchaseOrderState, formState } = FB.useStores();
    classes = FBPurchaseOrderClasses();

    handleShippingCost = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      purchaseOrderState?.setShippingCost(value);
    };

    handleDelete = (index: number) => (e: any) => {
      e.stopPropagation();
      !disabled && purchaseOrderState && purchaseOrderState.deleteItem(index);
    };

    useObserver(() => {
      calculation = purchaseOrderState?.calculation;
      items = purchaseOrderState?.items;
      formState?.setFieldValue(name, { items, ...calculation });
    });

    return Component({
      ...(props as T),
      handleShippingCost,
      handleDelete,
      classes,
      calculation,
      items,
      name,
    });
  };

  return (props: T) => Comp(props);
};
