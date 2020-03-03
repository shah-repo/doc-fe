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
  & Pick<FBOptionProps, "optionLabelKey" | "optionValueKey">
  & Pick<FBAutocompleteIndicator, "useValueKeyLabel">
  & {
    options?: any[];
    optionPath?: string;
    optionRenderKey?: string;
    renderEl?: boolean;
    valueType?: "object" | "key";
  };

export interface FBAutocompleteIndicator {
  id: string;
  path: string;
  label: string;
  optionLabelKey: string;
  optionValueKey?: string;
  root?: string;
  useValueKeyLabel?: boolean;
}
