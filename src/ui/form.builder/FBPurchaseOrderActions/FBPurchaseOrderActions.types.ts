import { ButtonProps } from "@material-ui/core";
import { FBCurrency } from "..";

export interface FBPurchaseOrderActionsProps {
  onAddClick?: ButtonProps["onClick"];
  onCancelClick?: ButtonProps["onClick"];
  totalPrice?: number;
  currency?: FBCurrency;
}
