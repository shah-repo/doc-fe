import { FBInputProps } from "..";

export type FBDatePickerProps =
& FBInputProps
& {
  onDatePickerClick?: () => void;
  onDatePickerClose?: () => void;
  disablePastDates?: boolean;
};
