import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { FB } from "..";
import { SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
// import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";
import { getReceivedQuantity } from "../FBPOReceive/utils";
import FBPurchaseOrderClasses from "./FBPurchaseOrderTable.styles";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";

/* eslint-disable no-console */

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCost,
    handleTaxChange,
    handleTaxBlur,
    handleCurrencyChange,
    handleDelete,
    handleReceiveAll,
    classes,
    calculation,
    loading,
    disabled,
    items,
    name,
    ...props
  }: T) => {

    // const dispatch = useDispatch();
    // const { purchaseOrderState, formState, poReceiveState, workspaceState } = FB.useStores();
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

    handleReceiveAll = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      items?.forEach((item) => (item.received = item?.order));
      purchaseOrderState?.setItems(items);
      // const formInput = workspaceState?.document?.formInput;
      // const selectPoKey = formInput
      //   && Object.keys(formInput).find((key) => key.startsWith("select-po"));
      //
      // if (selectPoKey) {
      //   const receivedItemsInputForm = {
      //     [selectPoKey]: {
      //       receivedItems: items?.map((item) => ({
      //         id: item.partNumber,
      //         received: item?.order,
      //       })) || [],
      //     },
      //   };
      //
      //   await poReceiveState?.setPOId(poReceiveState?.data?.id);
      //   dispatch(documentRevisionsActions.update(
      //       workspaceState?.document?.id as string,
      //       { formInput: receivedItemsInputForm }
      //   ));
      // }
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
        () => purchaseOrderState?.calculation,
        () => formState?.setFieldAutosave(name)
      );
      reaction(
        () => purchaseOrderState?.items,
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
      handleReceiveAll,
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
