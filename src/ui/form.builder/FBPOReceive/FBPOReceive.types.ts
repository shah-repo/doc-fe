import { FBPOReceiveState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBDialogState } from "../FBDialog";
import { PurchaseOrderItem } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import { FBInputProps } from "../types/common";

export type FBPOReceiveProps =
& Pick<FBInputProps, "name" | "index" | "label" | "afterChange" | "disabled">
& {
  dialogState?: FBDialogState;
  poReceiveState?: FBPOReceiveState;
  po?: DocumentRevision;
  schema?: FBInputProps[];
  loading?: boolean;
  items?: PurchaseOrderItem[];
  disableAutocomplete?: boolean;
};
