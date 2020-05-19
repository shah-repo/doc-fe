import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBPurchaseOrderFormProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBPurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import { generateDocIdLabel } from "./helpers";

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handlePartTitle,
    handleTotal,
    getOptionDisabled,
    getOptionLabel,
    handleTypeChange,
    type,
    ...props
  }: T) => {

    const { formState, purchaseOrderState } = FB.useStores();

    handlePartTitle = (_ev: any, value?: DocumentRevision) => {
      formState?.setFieldValue("partNumberTitle", value?.name, true);
      formState?.setValues({
        ...formState.getValues(),
        partNumberDocId: generateDocIdLabel(value),
        partNumber: value?.id,
      });
    };

    handleTotal = () => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setItemTotalAmount(item);
    };

    handleTypeChange = (ev: React.ChangeEvent<any>) => {
      const value = _.get(ev.target, "value");
      formState?.setFieldValue("type", value, true);
      formState?.setFieldValue("tax", false);
      formState?.setFieldValue("capitalEquipment", false);
      formState?.setFieldValue("isTraceabilityRequired", false);
      formState?.setFieldValue("partNumber", undefined);
      formState?.setFieldValue("partNumberTitle", undefined);
      formState?.setFieldValue("description", undefined);
    };

    getOptionDisabled = (option: DocumentRevision) => {
      const selectedParts = _.map(purchaseOrderState?.items, "partNumber");
      return _.includes(selectedParts, option.id);
    };

    getOptionLabel = (option) => generateDocIdLabel(option);

    useObserver(() => {
      type = formState?.inputState.get("type")?.value || formState?.getFieldValue("type");
      // type = formState?.getFieldValue("type");
    });

    return Component({
      ...(props as T),
      handlePartTitle,
      handleTotal,
      getOptionDisabled,
      getOptionLabel,
      handleTypeChange,
      type,
    });
  };

  return (props: T) => Comp(props);
};
