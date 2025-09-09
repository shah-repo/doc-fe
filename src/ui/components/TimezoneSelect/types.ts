import { AutocompleteProps } from '../forms/fields-next/Autocomplete/Autocomplete.types';

export interface TimezoneOption {
  value: string
  label: string
  offset: string
  abbrev: string
  altName: string
}

export type TimezoneSelectProps = Omit<AutocompleteProps, 'onChange' | 'value'> & {
  value: string
  onChange: (value: TimezoneOption | null) => void
};

export interface TimezoneResponseBody {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  abbreviation: string
  utcOffset: string
}
