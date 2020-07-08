import { FBFormProps, FBInputProps, FBPurchaseOrderItem } from "..";
import { FBAutocompleteProps } from "../FBAutocomplete";

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
