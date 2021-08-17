import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { FB } from "..";
import { SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";
import { getReceivedQuantity } from "../FBPOReceive/utils";
import FBPurchaseOrderClasses from "./FBPurchaseOrderTable.styles";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCost,
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
    const [taxField, setTaxField] = useState("");
    const isReceivable = checkIsDocumentReceivable(workspaceState?.document?.document.documentType.groupOptions);
    const smartReferencesFrom = workspaceState?.document?.document?.smartReferencesFrom?.filter(
      (ref) => ref.type === SmartReferenceType.LotSoruce);
    classes = FBPurchaseOrderClasses();

    handleShippingCost = (ev: React.ChangeEvent<any>) => {
      const { target: { value = 0 } = {} } = ev || {};
      const abs = Math.abs(value).toFixed(2).toString();
      purchaseOrderState?.setShippingCost(abs);
      ev.target.value = value;
    };

    handleTaxChange = (ev: React.ChangeEvent<any>) => {
      const { target: { value = "" } = {} } = ev || {};
      const taxInputPattern = /([0-9\.]+)/g;
      let fieldValue: string = value?.match(taxInputPattern)?.join("")
        .replace((/(.*)\./), (item) => item.replace(/\./g, "") + ".") || "0";
      fieldValue = value.endsWith("%") ? `${fieldValue}%` : `${fieldValue}`;
      setTaxField(fieldValue);
      purchaseOrderState?.calculateCost(fieldValue);
    };

    handleTaxBlur = () => {
      const tax = String(Number(purchaseOrderState?.calculation.tax || 0).toFixed(2));
      setTaxField(tax);
      purchaseOrderState?.setTax(tax);
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
      if (props.mode === "preview") {
        items?.map((item) => {
          const lots = smartReferencesFrom?.filter((ref) => item.id === ref.metadata?.fieldId);
          item.lots = lots?.map((lot) => lot.fromDocument?.docId).join(", ");
        });
      }
      formState?.setFieldValue(name, { items, ...calculation });
      loading = purchaseOrderState?.loading || workspaceState?.loadDocumentRevApi.loading;
    });

    React.useEffect(() => {
      reaction(
        () => formState?.getInputState(name || "")?.value,
        () => formState?.setFieldAutosave(name)
      );

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
      handleShippingCost,
      handleTaxChange,
      handleTaxBlur,
      handleCurrencyChange,
      handleDelete,
      classes,
      calculation,
      taxField,
      loading,
      disabled,
      items,
      name,
    });
  };

  return (props: T) => Comp(props);
};
