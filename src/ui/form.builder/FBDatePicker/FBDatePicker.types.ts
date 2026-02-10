import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { FBInputProps, FBProviderProps } from '..';

export interface StateProvider {
  getValue: () => string | undefined
  setValue: (value: string | undefined) => void
  validate?: () => void
}

export type FBDatePickerProps =
& Pick<FBProviderProps, 'datePickerState'>
& Omit<FBInputProps, 'onChange'>
& {
  onChange?: BaseKeyboardPickerProps['onChange']
  onDatePickerClick?: () => void
  onDatePickerClose?: () => void
  onDatePickerClear?: () => void
  onDateChange?: (date?: string) => void
  disablePastDates?: boolean
  // Custom state provider - if not provided, defaults to formState
  stateProvider?: StateProvider
};
