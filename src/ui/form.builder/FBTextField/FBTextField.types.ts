import { TextFieldProps } from "@material-ui/core/TextField";
import { FBInputProps, FBInputType } from "..";

export type FBTextFieldProps =
& FBInputProps
& Pick<TextFieldProps,
| "multiline"
| "type"
| "defaultValue"
| "id"
| "inputProps"
| "InputProps"
| "style"
| "size"
| "onBlur"
| "variant"
>
& {
  FBProps?: {
    inputType?: FBInputType;
  };
};
