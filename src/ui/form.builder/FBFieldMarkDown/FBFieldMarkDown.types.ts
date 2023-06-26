import { BoxProps } from '@material-ui/core';
import { FBInputProps } from '..';

export interface FBFieldMarkDownProps extends BoxProps {
  inputProps?: Partial<FBInputProps>
  source?: string
}
