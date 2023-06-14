import { FormControlProps, FormHelperTextProps, InputLabelProps } from '@material-ui/core';
import { PropsWithDataset } from '../../../../../common/types';

export type FormFieldProps = FormControlProps & {
  label?: React.ReactNode
  loading?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  helperText?: React.ReactNode
  labelProps?: PropsWithDataset<Partial<InputLabelProps>>
  helperTextProps?: PropsWithDataset<Partial<FormHelperTextProps>>
};
