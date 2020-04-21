import { TextFieldProps } from "@material-ui/core/TextField";
import { FBInputProps } from "..";

export type FBTextFieldProps =
  & FBInputProps
  & Pick<TextFieldProps, "multiline" | "type" | "defaultValue" | "id" | "inputProps">;
