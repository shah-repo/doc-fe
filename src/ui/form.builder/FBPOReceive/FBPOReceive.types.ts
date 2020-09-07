import { FBAutocompleteProps, FBDialogState, FBFormProps, FBInputProps, FBPOReceiveState, FBPurchaseOrderProps, FBSchemaProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export enum FBPOReceiveImportance {
  purchaseorder = 1,
  other = 2
}
export type FBPOReceiveProps =
& Pick<FBInputProps, "name" | "index" | "label" | "onChange" | "disabled">
& Pick<FBFormProps, "initialValues">
& Pick<FBAutocompleteProps, "getOptionLabel">
& {
  dialogState?: FBDialogState;
  poReceiveState?: FBPOReceiveState;
  po?: DocumentRevision;
  schema?: FBSchemaProps[];
  loading?: boolean;
};

export type FBPOReceiveItemProps =
& Pick<FBPurchaseOrderProps, "handleItem" | "mode">
& Partial<FBSchemaProps>;

