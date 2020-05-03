import { FBDialogState, FBInputProps, FBPurchaseOrderState } from "..";

export type FBPurchaseOrderProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& {
  handleAddItem?: () => any;
  purchaseOrderState?: FBPurchaseOrderState;
  dialogState?: FBDialogState;
};
