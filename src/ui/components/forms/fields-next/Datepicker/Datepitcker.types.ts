import { DatePickerProps as MuiDatepickerProps } from "@material-ui/pickers";

export type DatePickerProps = Omit<MuiDatepickerProps, "onBlur"> & {
  name?: string;
  onBlur?: React.FocusEventHandler;
};
