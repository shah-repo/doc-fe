import { AutocompleteProps } from '../forms/fields-next/Autocomplete/Autocomplete.types';

export interface TimezoneOption {
  value: string
  label: string
  offset: number
  abbrev: string
  altName: string
}

export type TimezoneSelectProps = AutocompleteProps & {
  onChange: (value: TimezoneOption | null) => void
};
