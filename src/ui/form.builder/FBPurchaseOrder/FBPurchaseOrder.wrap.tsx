import React from "react";
import { FB, FBDialogState, FBForm, FBPurchaseOrderActions, FBPurchaseOrderForm, FBPurchaseOrderItem, FBPurchaseOrderProps, FBPurchaseOrderState } from "..";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleItem,
    handleLot,
    purchaseOrderState,
    defaultValue,
    dialogState,
    disabled,
    name,
    ...props
  }: T) => {

    const { workspaceState, formState, poReceiveState } = FB.useStores();
    const formValue = formState?.getFieldValue(name, defaultValue);
    const isReceivable = checkIsDocumentReceivable(workspaceState?.document?.document.documentType.groupOptions);
    purchaseOrderState = FB.useRef<FBPurchaseOrderState>(FBPurchaseOrderState, {
      ...formValue,
      documentId: isReceivable ? poReceiveState?.data?.documentId : workspaceState?.document?.document?.id,
    });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    !handleItem && (handleItem = (item?: FBPurchaseOrderItem) => {
      if (disabled && !(workspaceState?.isDraft || workspaceState?.isPendingChange)) {
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
    });

    return Component({
      ...(props as T),
      handleItem,
      handleLot,
      purchaseOrderState,
      dialogState,
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};
