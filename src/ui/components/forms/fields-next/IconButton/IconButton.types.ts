import { BasicButtonKinds, ButtonProps } from '../Button/Button.types';

export type IconButtonProps = Omit<ButtonProps, 'kind'> & {
  kind?: BasicButtonKinds | 'simple' | 'destructive' | 'form' | 'action'
  iconSize?: number
};
