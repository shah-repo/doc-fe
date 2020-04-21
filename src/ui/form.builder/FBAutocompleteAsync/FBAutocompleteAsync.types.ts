import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { FBAutocompleteAsyncState, FBAutocompleteProps } from "..";

export type FBAutocompleteAsyncProps =
& FBAutocompleteProps
& Pick<Partial<AutocompleteProps>, "renderInput" | "loading" | "defaultValue" | "renderTags">
& {
  autocompleteAsyncState?: FBAutocompleteAsyncState;
  selectedOptions?: string[];
};

export interface FBAutocompleteAsyncConfig  {
  id: string;
  path: string;
  label: string;
  labelKey: string;
  valueKey?: string;
  root?: string;
  labelPrefixRoot?: string;
}
