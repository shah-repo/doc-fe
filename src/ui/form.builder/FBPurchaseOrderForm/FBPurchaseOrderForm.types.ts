import { FBAutocompleteProps, FBFormProps, FBInputProps, FBProviderProps } from '..';

export type FBPurchaseOrderFormProps =
& Pick<FBProviderProps, 'formState' | 'purchaseOrderState'>
& Pick<FBFormProps, 'children' | 'initialValues'>
& {
  handlePartTitle?: FBInputProps['onChange']
  handleTotal?: FBInputProps['onChange']
  getOptionDisabled?: FBAutocompleteProps['getOptionDisabled']
  getOptionLabel?: FBAutocompleteProps['getOptionLabel']
  handlePartDescription?: FBInputProps['onChange']
};
