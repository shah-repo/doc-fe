import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB } from "..";
import FBPurchaseOrderClasses from "./FBPurchaseOrderTable.styles";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCost,
    handleCurrencyChange,
    handleDelete,
    classes,
    calculation,
    loading,
    disabled,
    items,
    name,
    ...props
  }: T) => {

    const { purchaseOrderState, formState } = FB.useStores();
    classes = FBPurchaseOrderClasses();

    handleShippingCost = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      const abs = Math.abs(value).toFixed(2).toString();
      purchaseOrderState?.setShippingCost(abs);
      ev.target.value = abs;
    };

    handleCurrencyChange = (ev, currency) =>
      purchaseOrderState?.setCurrency(currency.props.value);

    handleDelete = (index: number) => (e: any) => {
      e.stopPropagation();
      !disabled && purchaseOrderState && purchaseOrderState.deleteItem(index);
    };

    useObserver(() => {
      calculation = purchaseOrderState?.calculation;
      items = purchaseOrderState?.items;
      formState?.setFieldValue(name, { items, ...calculation });
      loading = purchaseOrderState?.loading;
    });

    React.useEffect(() => {
      reaction(
        () => purchaseOrderState?.calculation,
        () => formState?.setFieldAutosave(name)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      handleShippingCost,
      handleCurrencyChange,
      handleDelete,
      classes,
      calculation,
      loading,
      disabled,
      items,
      name,
    });
  };

  return (props: T) => Comp(props);
};
