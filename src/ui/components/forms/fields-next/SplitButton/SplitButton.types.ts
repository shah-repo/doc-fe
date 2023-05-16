import { MenuProps } from '@material-ui/core';
import { PropsWithDataset } from '../../../../../common/types';
import { ButtonProps } from '../Button/Button.types';
import { ButtonGroupProps } from '../ButtonGroup/ButtonGroup.types';

export type SplitButtonProps = Omit<ButtonGroupProps, 'onClick'> & {
  buttonText: React.ReactNode;
  buttonProps?: PropsWithDataset<ButtonProps>;
  toggleProps?: PropsWithDataset<ButtonProps>;
  toggleIcon?: React.ReactNode;
  onClick?: ButtonProps['onClick'];
  onToggle?: ButtonProps['onClick'];
};

export type SplitButtonMenuProps = Omit<MenuProps, 'open' | 'onClose'> & {
  onClose?: {
    bivarianceHack(event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'itemClick'): void;
  }['bivarianceHack'];
};
