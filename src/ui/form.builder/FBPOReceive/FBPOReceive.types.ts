import { FBPOReceiveState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBDialogState } from "../FBDialog";
import { PurchaseOrderItem } from "../FBPurchaseOrder_/FBPurchaseOrder.types";
import { FBInputProps } from "../types/common";

export type FBPOReceiveProps =
& Pick<FBInputProps, "name" | "index" | "label" | "afterChange">
& {
  dialogState?: FBDialogState;
  poReceiveState?: FBPOReceiveState;
  po?: DocumentRevision;
  schema?: FBInputProps[];
  loading?: boolean;
  items?: PurchaseOrderItem[];
};
