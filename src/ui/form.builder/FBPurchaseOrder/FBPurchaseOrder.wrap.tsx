import React from "react";
import { FB, FBDialogState, FBForm, FBPurchaseOrderActions, FBPurchaseOrderForm, FBPurchaseOrderProps, FBPurchaseOrderState } from "..";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAddItem,
    purchaseOrderState,
    dialogState,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    purchaseOrderState = FB.useRef<FBPurchaseOrderState>(FBPurchaseOrderState, formValue);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    handleAddItem = () => {
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.add.item",
        content: (
          <FBForm>
            <FBPurchaseOrderForm />
          </FBForm>
        ),
        actions: <FBPurchaseOrderActions />,
      });
    };

    return Component({
      ...(props as T),
      handleAddItem,
      purchaseOrderState,
      dialogState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
