import { DialogActionsProps as MuiDialogActionsProps, DialogContentProps as MuiDialogContentProps, DialogProps as MuiDialogProps, DialogTitleProps as MuiDialogTitleProps } from '@material-ui/core';
import { PropsWithDataset } from '../../../common/types';
import { Translation } from '../../translations/types';
import { ButtonProps } from '../forms/fields-next/Button/Button.types';

type DialogBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export enum DialogCloseReason {
  BACKDROP_CLICK = 'backdropClick',
  ESCAPE_KEYDOWN = 'escapeKeyDown',
  CLOSE_CLICK = 'closeClick',
  CANCEL_CLICK ='cancelClick',
}

export interface DialogProps extends Omit<MuiDialogProps, 'title' | 'onClose'> {
  breakpoint?: DialogBreakpoint
  loading?: boolean
  hideCloseButton?: boolean
  title?: React.ReactNode | Translation
  titleProps?: PropsWithDataset<MuiDialogTitleProps>
  contentProps?: PropsWithDataset<MuiDialogContentProps>
  actions?: React.ReactNode
  actionsRef?: React.MutableRefObject<unknown>
  actionsProps?: PropsWithDataset<MuiDialogActionsProps>
  confirmLabel?: React.ReactNode | Translation
  cancelLabel?: React.ReactNode | Translation
  confirmProps?: PropsWithDataset<ButtonProps>
  cancelProps?: PropsWithDataset<ButtonProps>
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: {
    bivarianceHack(event: {}, reason: DialogCloseReason): void
  }['bivarianceHack']
}

export type DialogActionsProps = Pick<
  DialogProps,
  'confirmLabel' | 'onConfirm' | 'cancelLabel' | 'onCancel' | 'confirmProps' | 'cancelProps'
>;
