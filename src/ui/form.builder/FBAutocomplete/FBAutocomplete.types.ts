import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete";
import { FBAutocompleteState } from ".";
import { FBStateProps } from "../helpers/FBStateProps";
import { FBInputProps, FBOptionProps } from "../types/common";

export type FBAutocompleteProps =
  & FBInputProps
  & Pick<AutocompleteProps, "renderInput" | "loading" | "defaultValue" | "renderTags">
  & Pick<UseAutocompleteProps, "getOptionLabel" | "filterOptions">
  & FBStateProps<FBAutocompleteState>
  & Pick<FBOptionProps, "optionLabelKey">
  & {
    options?: any[];
    optionPath?: string;
    optionRenderKey?: string;
  };

export interface FBAutocompleteIndicator {
  id: string;
  path: string;
  label: string;
  renderKey: string;
}
