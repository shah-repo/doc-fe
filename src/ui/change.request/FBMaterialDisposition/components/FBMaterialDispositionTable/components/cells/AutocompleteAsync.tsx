import React from 'react';
import { Autocomplete } from '../../../../../../components/forms/fields-next';
import { AutocompleteProps } from '../../../../../../components/forms/fields-next/Autocomplete/Autocomplete.types';
import { FBAutocompleteAsyncProps } from '../../../../../../form.builder';
import { withFBAutocompleteAsync } from '../../../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.wrap';
type AutocompleteAsyncProps = FBAutocompleteAsyncProps & AutocompleteProps;
const AutocompleteAsync: React.FunctionComponent<
AutocompleteAsyncProps
> = ({ defaultValue, loading, ...props }) => (
  <Autocomplete {...props} value={defaultValue} key={loading ? 'disable' : 'enable' } />
);
export default withFBAutocompleteAsync(AutocompleteAsync);
