import { FBAutocompleteAsyncOption, FBAutocompleteAsyncProps, FBInputProps } from "..";

export type FBEBPartAutocompleteProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "loading" | "defaultValue">
& FBAutocompleteAsyncProps
& {
  autocompleteOption: FBAutocompleteAsyncOption.availablePartDocuments | FBAutocompleteAsyncOption.availableParts;
};
