import { FBAutocompleteProps, FBFormProps, FBInputProps, FBPurchaseOrderItem } from "..";

export type FBPurchaseOrderFormProps =
& Pick<FBFormProps, "children">
& {
  handlePartTitle?: FBInputProps["onChange"];
  handleTotal?: FBInputProps["onChange"];
  getOptionDisabled?: FBAutocompleteProps["getOptionDisabled"];
  getOptionLabel?: FBAutocompleteProps["getOptionLabel"];
  handleTypeChange?: FBInputProps["onChange"];
  type?: FBPurchaseOrderItem["type"];
  handlePartDescription?: FBInputProps["onChange"];
  hasPartNumber?: boolean;
};
