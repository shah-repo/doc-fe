import { BoxProps, FormGroupProps } from '@material-ui/core';
import { FBInputProps, FBOptionProps } from '..';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';

export type FBCheckboxGroupAsyncProps =
  & FBOptionProps
  & Partial<Pick<FBInputProps,
  | 'onChange'
  | 'name'
  | 'label'
  | 'optionId'
  | 'disabled'
  | 'defaultValue'
  | 'applicableValidationSchema'
  | 'isInputOwner'
  | 'rules'
  >>
  & Pick<FormGroupProps, 'row'>
  & {
    controls?: React.ReactNode[]
    className?: string
    boxProps?: BoxProps
    labelProps?: BoxProps
  };

export interface CheckBoxOptionType extends OptionType{
  value: string
  disabled?: boolean
}
