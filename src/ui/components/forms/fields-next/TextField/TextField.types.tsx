import { InputBaseProps } from '@material-ui/core';

export interface TextFieldProps extends InputBaseProps {
  size?: 'small' | 'medium'
  autosize?: boolean
}
