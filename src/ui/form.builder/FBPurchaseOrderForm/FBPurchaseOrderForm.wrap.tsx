import _ from "lodash";
import React from "react";
import { FB, FBPurchaseOrderFormProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handlePartTitle,
    handleTotal,
    ...props
  }: T) => {

    const { formState, purchaseOrderState } = FB.useStores();

    handlePartTitle = (_ev: any, value?: DocumentRevision) => {
      formState?.setFieldValue("partNumberTitle", value?.name, true);
      formState?.setValues({
        ...formState.getValues(),
        partNumberDocId: value?.document.docId,
        partNumber: value?.id,
      });
    };

    handleTotal = () => {
      const { unitPrice = 0, order = 0 } = formState?.getValues() || {};
      purchaseOrderState?.setTotalPrice(_.toNumber(unitPrice) * _.toNumber(order));
    };

    return Component({
      ...(props as T),
      handlePartTitle,
      handleTotal,
    });
  };

  return (props: T) => Comp(props);
};
