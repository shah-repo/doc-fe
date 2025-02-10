import { InputBaseProps, InputProps } from '@material-ui/core';
import { AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';

export interface AutocompleteInputProps extends InputBaseProps {
  InputProps: InputProps
  size: AutocompleteProps['size']
}

export type AutocompleteProps = Partial<MuiAutocompleteProps> & {
  name?: string
  error?: boolean
  onBlur?: React.FocusEventHandler
  inputProps?: InputProps
};
