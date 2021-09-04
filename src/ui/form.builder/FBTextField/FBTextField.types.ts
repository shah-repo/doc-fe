import { TextFieldProps } from "@material-ui/core/TextField";
import { FBInputProps, FBInputType, FBWorkspaceProps } from "..";

export type FBTextFieldProps =
  & FBInputProps
  & Pick<FBWorkspaceProps, "mode">
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
    | "className"
    | "onFocus"
  >
  & {
    dataCy?: string;
    FBProps?: {
      inputType?: FBInputType;
    };
  };
