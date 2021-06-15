import { get, includes, map } from "lodash";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { FB, FBPurchaseOrderFormProps, FBPurchaseOrderItem } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
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
    const [hasPartNumber, setPartNumber] = useState("");

    handlePartTitle = (_ev: any, value?: DocumentRevision) => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      setPartNumber(item.partNumber);
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
      const value = get(ev.target, "value");
      formState?.setFieldValue("type", value, true);
      formState?.setFieldValue("tax", false);
      formState?.setFieldValue("capitalEquipment", false);
      formState?.setFieldValue("isTraceabilityRequired", false);
      formState?.setFieldValue("partNumber", undefined);
      formState?.setFieldValue("partNumberTitle", undefined);
      formState?.setFieldValue("description", undefined);
      if (value === "product") {
        formState?.setFieldRules("partNumber", "required_without:supplierPartNumber");
        formState?.setFieldRules("supplierPartNumber", "required_without:partNumber");
        formState?.setFieldFinalValidationRules("partNumber", "required_without:supplierPartNumber");
        formState?.setFieldFinalValidationRules("supplierPartNumber", "required_without:partNumber");
      }
      else {
        formState?.removeFieldRules("partNumber");
        formState?.removeFieldRules("supplierPartNumber");
      }
    };

    const handlePartDescription = (ev: React.ChangeEvent<any>) => {
      const value = get(ev.target, "value");
      formState?.setFieldValue("partNumberTitle", value, true);
    };

    getOptionDisabled = (option: DocumentRevision) => {
      const selectedParts = map(purchaseOrderState?.items, "partNumber");
      return includes(selectedParts, option.id);
    };

    getOptionLabel = (option) => generateDocIdLabel(option);

    useObserver(() => {
      type = formState?.inputState.get("type")?.value || formState?.getFieldValue("type");
    });

    return Component({
      ...(props as T),
      handlePartTitle,
      handleTotal,
      getOptionDisabled,
      getOptionLabel,
      handleTypeChange,
      handlePartDescription,
      hasPartNumber,
      type,
    });
  };

  return (props: T) => Comp(props);
};
