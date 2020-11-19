import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete";
import { FBAutocompleteAsyncConfig, FBInputProps } from "..";

export type FBAutocompleteProps =
 & FBInputProps
 & Pick<Partial<AutocompleteProps>, "renderOption">
 & Pick<FBAutocompleteAsyncConfig, "labelPrefixRoot" | "includeRevision">
 & Pick<UseAutocompleteProps,
 | "getOptionLabel"
 | "filterOptions"
 | "getOptionDisabled"
 | "freeSolo"
 | "filterSelectedOptions"
 | "groupBy"
 > & {
   onInputChange?: (ev: React.FocusEvent<HTMLInputElement>) => any;
   refresh?: () => any;
   disabledOptions?: string[];
   groupByKey?: string;
 };
