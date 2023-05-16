import { BoxProps } from '@material-ui/core';

export type SMBoxProps =
& BoxProps
& {
  stretchY?: string;
  stretchX?: string;
};
