import { ButtonProps } from "@material-ui/core";
import { FBProviderProps } from "..";

export type FBPurchaseOrderActionsProps =
& Pick<FBProviderProps, "purchaseOrderState">
& {
  onAddClick?: ButtonProps["onClick"];
  onCancelClick?: ButtonProps["onClick"];
};
