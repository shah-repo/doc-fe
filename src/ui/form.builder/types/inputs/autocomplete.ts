import { AutocompleteProps } from "@material-ui/lab/Autocomplete/Autocomplete";
import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete/useAutocomplete";
import { FBInputProps, FBOptionProps } from "../common";
import { FBFormikFieldProps } from "../formik";

export type FBAutocompleteProps =
  & FBInputProps
  & FBOptionProps
  & Omit<FBFormikFieldProps, "name">
  & Pick<AutocompleteProps, "renderInput">
  & Pick<UseAutocompleteProps, "getOptionLabel" | "filterOptions" | "onChange" | "multiple">
  & {
    optionId?: string;
    optionLabel?: string;
  };
