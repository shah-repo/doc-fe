import { BoxProps, FormGroupProps } from '@material-ui/core';
import { FBInputProps, FBOptionProps } from '..';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';

interface FBCheckboxGroupBaseProps {
  controls?: React.ReactNode[]
  className?: string
  boxProps?: BoxProps
  labelProps?: BoxProps
  options?: CheckBoxOptionType[]
  setSelectedCheckBoxOptions?: React.Dispatch<React.SetStateAction<OptionType[]>>
  selectedCheckBoxOptions: OptionType[]
}

type FBCheckboxGroupInputProps = Partial<Pick<
FBInputProps,
| 'onChange'
| 'name'
| 'label'
| 'optionId'
| 'disabled'
| 'defaultValue'
| 'applicableValidationSchema'
| 'isInputOwner'
| 'rules'
>>;

type FBCheckboxGroupLayoutProps = Pick<FormGroupProps, 'row'>;

export type FBCheckboxGroupAsyncProps =
  FBCheckboxGroupBaseProps &
  FBOptionProps &
  FBCheckboxGroupInputProps &
  FBCheckboxGroupLayoutProps;

export interface CheckBoxOptionType extends OptionType {
  value: string
  disabled?: boolean
}
