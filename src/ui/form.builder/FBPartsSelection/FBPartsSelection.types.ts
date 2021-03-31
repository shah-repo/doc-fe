import { FBAutocompleteAsyncProps, FBId } from "..";

export type FBPartsSelectionProps =
& FBAutocompleteAsyncProps
& {
  isOutput?: boolean;
  editorConfig?: FBId;
};
