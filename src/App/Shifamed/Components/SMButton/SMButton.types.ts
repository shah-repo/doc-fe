import { ButtonProps } from '@material-ui/core';
import { SMInputProps } from '../../..';

export type SMButtonProps =
& ButtonProps
& Pick<SMInputProps, 'label'>
& {
  dataCy?: string;
};
