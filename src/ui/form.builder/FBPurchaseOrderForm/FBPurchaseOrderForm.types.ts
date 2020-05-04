import { FBFormProps, FBInputProps } from "..";
import { FBAutocompleteProps } from "../FBAutocomplete";

export type FBPurchaseOrderFormProps =
& Pick<FBFormProps, "children">
& {
  handlePartTitle?: FBInputProps["onChange"];
  handleTotal?: FBInputProps["onChange"];
  getOptionDisabled?: FBAutocompleteProps["getOptionDisabled"];
};
