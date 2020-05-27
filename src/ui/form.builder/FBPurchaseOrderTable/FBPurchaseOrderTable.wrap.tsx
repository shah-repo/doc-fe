import { useObserver } from "mobx-react";
import React from "react";
import { FBPurchaseOrderClasses } from ".";
import { FB, FBPurchaseOrderTableProps } from "..";
import { useFormContext } from "../../components/forms/FormContext";

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
    const { submitForm } = useFormContext();
    classes = FBPurchaseOrderClasses();

    handleShippingCost = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      purchaseOrderState?.setShippingCost(value);
    };

    handleCurrencyChange = (ev, currency) => {
      purchaseOrderState?.setCurrency(currency.props.value);
    };

    handleDelete = (index: number) => (e: any) => {
      e.stopPropagation();
      if (!disabled && purchaseOrderState) {
        purchaseOrderState.deleteItem(index);
        submitForm();
      }
    };

    useObserver(() => {
      calculation = purchaseOrderState?.calculation;
      items = purchaseOrderState?.items;
      formState?.setFieldValue(name, { items, ...calculation });
      loading = purchaseOrderState?.loading;
    });

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
