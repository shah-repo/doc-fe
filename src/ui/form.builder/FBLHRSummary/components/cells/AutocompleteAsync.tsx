import React from 'react';
import { FBAutocompleteAsyncProps } from '../../..';
import { Autocomplete } from '../../../../components/forms/fields-next';
import { AutocompleteProps } from '../../../../components/forms/fields-next/Autocomplete/Autocomplete.types';
import { withFBAutocompleteAsync } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.wrap';

type AutocompleteAsyncProps = FBAutocompleteAsyncProps & AutocompleteProps;

const AutocompleteAsync: React.FunctionComponent<
AutocompleteAsyncProps
> = ({ defaultValue, ...props }) => (
  <Autocomplete {...props} value={defaultValue} />
);

export default withFBAutocompleteAsync(AutocompleteAsync);
