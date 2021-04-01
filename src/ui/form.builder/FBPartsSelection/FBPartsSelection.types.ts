import { FBAutocompleteAsyncProps, FBAutocompleteProps, FBId } from "..";

export type FBPartsSelectionProps =
& FBAutocompleteAsyncProps
& {
  isOutput?: boolean;
  editorConfig?: FBId;
  filteredOptions?: FBAutocompleteProps["filterOptions"];
  isDocumentLHR?: boolean;
};
