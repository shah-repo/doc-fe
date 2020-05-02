import React from "react";
import { FB, FBPurchaseOrderFormProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handlePartTitle,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    handlePartTitle = (_ev: any, value?: DocumentRevision) => {
      formState?.setFieldValue("partNumberTitle", value?.name, true);
      formState?.setValues({
        ...formState.getValues(),
        partNumberDocId: value?.document.docId,
        partNumber: value?.id,
      });
    };

    return Component({
      ...(props as T),
      handlePartTitle,
    });
  };

  return (props: T) => Comp(props);
};
