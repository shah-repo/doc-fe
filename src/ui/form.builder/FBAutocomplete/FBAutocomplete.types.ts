import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete";
import { FBAutocompleteAsyncConfig, FBInputProps } from "..";

export type FBAutocompleteProps =
 & FBInputProps
 & Pick<Partial<AutocompleteProps>, "renderOption">
 & Pick<FBAutocompleteAsyncConfig, "labelPrefixRoot">
 & Pick<UseAutocompleteProps,
 | "getOptionLabel"
 | "filterOptions"
 | "getOptionDisabled"
 | "freeSolo"
 | "filterSelectedOptions"
 | "groupBy"
 > & {
   refresh?: () => any;
   disabledOptions?: string[];
   groupByKey?: string;
 };
