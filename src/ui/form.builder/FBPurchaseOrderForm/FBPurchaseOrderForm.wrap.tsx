import _ from "lodash";
import React from "react";
import { FB, FBPurchaseOrderFormProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { generateVersionNumber } from "../../documentRevision/helpers";
import { FBPurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handlePartTitle,
    handleTotal,
    getOptionDisabled,
    getOptionLabel,
    ...props
  }: T) => {

    const { formState, purchaseOrderState } = FB.useStores();
    const generateDocIdLabel = (docRev) => {
      const { document: { docId } } = docRev;
      return `${docId} - ${docIdVersion(docRev)}`;
    };
    const docIdVersion = (docRev) => {
      const { revision, revisionStage, revisionChangeType } = docRev;
      return generateVersionNumber(revision, revisionStage, revisionChangeType);
    };

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

    getOptionDisabled = (option: DocumentRevision) => {
      const selectedParts = _.map(purchaseOrderState?.items, "partNumber");
      return _.includes(selectedParts, option.id);
    };

    getOptionLabel = (option) => generateDocIdLabel(option);

    return Component({
      ...(props as T),
      handlePartTitle,
      handleTotal,
      getOptionDisabled,
      getOptionLabel,
    });
  };

  return (props: T) => Comp(props);
};
