import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete";
import { FBInputProps } from "../types/common";

export type FBAutocompleteProps =
 & FBInputProps
 & Pick<UseAutocompleteProps, "getOptionLabel" | "filterOptions"> & {
   refresh?: () => any;
   options?: any[];
 };
