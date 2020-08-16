import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete";
import { FBInputProps } from "..";

export type FBAutocompleteProps =
 & FBInputProps
 & Pick<UseAutocompleteProps,
 | "getOptionLabel"
 | "filterOptions"
 | "getOptionDisabled"
 | "freeSolo"
 | "filterSelectedOptions"
 > & {
   refresh?: () => any;
   disabledOptions?: string[];
 };
