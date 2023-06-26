import { BoxProps } from '@material-ui/core';
import { FBFormProps, FBInputProps } from '..';

export type FBFieldOutputWrapperProps =
  & Pick<FBFormProps, 'children'>
  & Pick<BoxProps, 'mt' | 'mb'>
  & {
    inputProps?: Partial<FBInputProps>
    position: number
  };
