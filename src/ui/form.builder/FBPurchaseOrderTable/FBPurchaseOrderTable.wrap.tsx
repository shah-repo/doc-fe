import { omit } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB } from "..";
import { SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";
import { getReceivedQuantity } from "../FBPOReceive/utils";
import FBPurchaseOrderClasses from "./FBPurchaseOrderTable.styles";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";

// TODO: remove after test
/* eslint-disable no-console */

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCostChange,
    handleShippingCostBlur,
    handleTaxRateChange,
    handleTaxRateBlur,
    handleTaxChange,
    handleTaxBlur,
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

    const { purchaseOrderState, formState, workspaceState } = FB.useStores();
    const isReceivable = checkIsDocumentReceivable(workspaceState?.document?.document.documentType.groupOptions);
    const smartReferencesFrom = workspaceState?.document?.document?.smartReferencesFrom?.filter(
      (ref) => ref.type === SmartReferenceType.LotSoruce);
    classes = FBPurchaseOrderClasses();

    handleShippingCostChange = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      const abs = Math.abs(value).toFixed(2).toString();
      purchaseOrderState?.setShippingCost(abs);
      ev.target.value = value;
    };

    handleShippingCostBlur = () => {
      if (!purchaseOrderState) { return; }
      purchaseOrderState.value = purchaseOrderState?.calculateCost();
    };

    handleTaxRateChange = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      const abs = Math.abs(value).toFixed(2).toString();
      purchaseOrderState?.setTaxRate(abs);
      ev.target.value = value;
    };
    handleTaxRateBlur = (ev: React.ChangeEvent<any>) => {
      if (!purchaseOrderState) { return; }
      purchaseOrderState.value = purchaseOrderState?.calculateCost();
    };

    handleTaxChange = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      const abs = Math.abs(value).toFixed(2).toString();
      purchaseOrderState?.setTax(abs);
      ev.target.value = value;
    };
    handleTaxBlur = () => {
      if (!purchaseOrderState) { return; }
      const tax = String(Number(purchaseOrderState?.value.tax || 0).toFixed(2));
      purchaseOrderState?.setTaxRateByTax(tax);
    };

    handleCurrencyChange = (ev, currency) =>
      purchaseOrderState?.setCurrency(currency.props.value);

    handleDelete = (index: number) => (e: any) => {
      e.stopPropagation();
      !disabled && purchaseOrderState && purchaseOrderState.deleteItem(index);
    };

    useObserver(() => {
      calculation = omit(purchaseOrderState?.value, "items");
      items = purchaseOrderState?.value.items;
      if (props.mode === "preview") {
        items?.map((item) => {
          const lots = smartReferencesFrom?.filter((ref) => item.id === ref.metadata?.fieldId);
          item.lots = lots?.map((lot) => lot.fromDocument?.docId).join(", ");
        });
      }
      formState?.setFieldValue(name, { ...purchaseOrderState?.value }, true);
      loading = purchaseOrderState?.loading || workspaceState?.loadDocumentRevApi.loading;
    });

    useEffect(() => reaction(
      () => purchaseOrderState?.value,
      (value) => {
        formState?.setFieldValue(name, value);
        workspaceState?.saveDocRev(formState?.getValues());
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => {
      if (isReceivable)  { purchaseOrderState?.getPartsVersion(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (isReceivable) {
      const receivedName = workspaceState?.schema?.find((e) => e.type === "poreceive")?.name as string;
      const receivedItems = workspaceState?.getFieldByName(receivedName)?.receivedItems || [];
      items = items?.map( (item) => {
        const id = item.partNumber || item.id;
        const received = getReceivedQuantity(receivedItems, id) || 0;
        return {
          ...item,
          received,
        };
      });
    }

    return Component({
      ...(props as T),
      handleShippingCostChange,
      handleShippingCostBlur,
      handleTaxRateChange,
      handleTaxRateBlur,
      handleTaxChange,
      handleTaxBlur,
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
