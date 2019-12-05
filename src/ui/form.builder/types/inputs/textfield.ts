import { BaseTextFieldProps } from "@material-ui/core/TextField/TextField";
import { FBInputProps } from "../common";

export type FBTextFieldProps =
  & FBInputProps
  & Pick<BaseTextFieldProps, "rows">;
