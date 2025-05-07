import { BoxProps, FormGroupProps } from '@material-ui/core';
import { FBInputProps, FBOptionProps } from '..';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';

interface FBSupplierCheckboxGroupBaseProps {
  controls?: React.ReactNode[]
  className?: string
  boxProps?: BoxProps
  labelProps?: BoxProps
  options?: CheckBoxOptionType[]
  setSelectedCheckBoxOptions?: React.Dispatch<React.SetStateAction<OptionType[]>>
  selectedCheckBoxOptions: OptionType[]
}

type FBSupplierCheckboxGroupInputProps = Partial<Pick<
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

type FBSupplierCheckboxGroupLayoutProps = Pick<FormGroupProps, 'row'>;

export type FBSupplierCheckboxGroupAsyncProps =
  FBSupplierCheckboxGroupBaseProps &
  FBOptionProps &
  FBSupplierCheckboxGroupInputProps &
  FBSupplierCheckboxGroupLayoutProps;

export interface CheckBoxOptionType extends OptionType {
  value: string
  disabled?: boolean
}
