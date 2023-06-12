import { ButtonProps } from '@material-ui/core/Button';
import { FBFormDefaultProps } from './common';

export type FBButtonProps =
& ButtonProps
& Omit<FBFormDefaultProps, 'label'>
& {
  component?: (props: any) => JSX.Element;
  label?: string;
  buttonType?: 'button' | 'submit';
};
