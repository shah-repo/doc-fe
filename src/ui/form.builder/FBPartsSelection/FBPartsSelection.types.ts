import { FBId } from "..";
import { FBAutocompleteAsyncProps } from "../FBAutocompleteAsync/FBAutocompleteAsync.types";

export type FBPartsSelectionProps =
& FBAutocompleteAsyncProps
& {
  isOutput?: boolean;
  editorConfig?: FBId;
};
