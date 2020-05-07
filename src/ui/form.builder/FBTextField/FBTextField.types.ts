import { TextFieldProps } from "@material-ui/core/TextField";
import { FBInputProps } from "..";
import { FBInputType } from "../FBInput";

export type FBTextFieldProps =
& FBInputProps
& Pick<TextFieldProps,
| "multiline"
| "type"
| "defaultValue"
| "id"
| "inputProps"
| "InputProps"
| "variant"
| "style"
| "size"
| "onBlur"
>
& {
  FBProps?: {
    inputType?: FBInputType;
  };
};
