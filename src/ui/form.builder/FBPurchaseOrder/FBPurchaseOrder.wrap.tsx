import React from "react";
import { FB, FBDialogState, FBForm, FBPurchaseOrderActions, FBPurchaseOrderForm, FBPurchaseOrderItem, FBPurchaseOrderProps, FBPurchaseOrderState } from "..";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleItem,
    purchaseOrderState,
    dialogState,
    disabled,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    purchaseOrderState = FB.useRef<FBPurchaseOrderState>(FBPurchaseOrderState, formValue);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    handleItem = (item?: FBPurchaseOrderItem) => {
      if (disabled) {
        return;
      }
      purchaseOrderState?.setItemTotalAmount(item);
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.add.item",
        content: (
          <FBForm initialValues={item}>
            <FBPurchaseOrderForm />
          </FBForm>
        ),
        actions: <FBPurchaseOrderActions />,
      });
    };

    return Component({
      ...(props as T),
      handleItem,
      purchaseOrderState,
      dialogState,
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};
