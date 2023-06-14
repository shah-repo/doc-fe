import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { FBInputProps, FBProviderProps } from '..';

export type FBDatePickerProps =
& Pick<FBProviderProps, 'datePickerState'>
& Omit<FBInputProps, 'onChange'>
& {
  onChange?: BaseKeyboardPickerProps['onChange']
  onDatePickerClick?: () => void
  onDatePickerClose?: () => void
  disablePastDates?: boolean
};
