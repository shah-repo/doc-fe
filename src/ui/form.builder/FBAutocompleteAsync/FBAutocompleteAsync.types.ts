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

export enum FBAutocompleteAsyncOption {
  revision = "1",
  request = "2",
  approver = "3",
  type = "4",
  supplier = "5",
  tl = "6",
  csl = "7",
  address = "8",
  gl = "9",
  group = "10",
  part = "11",
  po = "12",
  employees = "13",
  officialGroups = "14",
}
