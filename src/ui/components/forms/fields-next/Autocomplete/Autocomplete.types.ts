import { AutocompleteProps as MuiAutocompleteProps } from "@material-ui/lab/Autocomplete";

export type AutocompleteProps = Omit<MuiAutocompleteProps, "renderInput" | "onBlur"> & {
  name?: string;
  error?: boolean;
  onBlur?: React.FocusEventHandler;
};
