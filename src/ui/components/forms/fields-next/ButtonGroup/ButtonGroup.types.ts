import { ButtonGroupProps as MuiButtonGroupProps } from '@material-ui/core';
import { BasicButtonKinds } from '../Button/Button.types';

export type ButtonGroupProps = MuiButtonGroupProps & {
  kind?: BasicButtonKinds;
};
