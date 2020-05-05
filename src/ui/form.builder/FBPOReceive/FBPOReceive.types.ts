import { FBPOReceiveState, FBPurchaseOrderItem } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBDialogState } from "../FBDialog";
import { FBInputProps } from "../types/common";

export type FBPOReceiveProps =
& Pick<FBInputProps, "name" | "index" | "label" | "afterChange">
& {
  dialogState?: FBDialogState;
  poReceiveState?: FBPOReceiveState;
  po?: DocumentRevision;
  schema?: FBInputProps[];
  loading?: boolean;
  items?: FBPurchaseOrderItem[];
};
