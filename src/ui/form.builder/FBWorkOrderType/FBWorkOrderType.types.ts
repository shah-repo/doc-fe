import { RadioGroupProps } from '@material-ui/core';
import { FBInputProps, FBOptionProps } from '..';
import { Dialog } from '../../hooks/useDialog';

export type FBWorkOrderTypeProps =
& FBOptionProps
& Omit<FBInputProps, 'onChange'>
& Pick<RadioGroupProps, 'row' | 'onChange'>
& {
  controls?: React.ReactNode[]
  controlValue?: string
  confirmationDialog?: Dialog
  confirmAlertDialog?: () => void
  cancelAlertDialog?: () => void
  setForceRender: (flag: boolean) => void
  forceRender?: boolean
};
