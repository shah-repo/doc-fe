import { FBAutocompleteProps, FBDialogState, FBFormProps, FBInputProps, FBPOReceiveState, FBPurchaseOrderProps, FBSchemaProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBPOReceiveProps =
& Pick<FBInputProps, "name" | "index" | "label" | "onChange" | "disabled" | "defaultValue" | "gutter">
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

