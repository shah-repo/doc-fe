import { RadioGroupProps } from '@material-ui/core';
import { FBInputProps, FBOptionProps } from '..';

export type FBRadioGroupProps =
& FBOptionProps
& Omit<FBInputProps, 'onChange'>
& Pick<RadioGroupProps, 'row' | 'onChange'>
& {
  controls?: React.ReactNode[];
  controlValue?: string;
};
