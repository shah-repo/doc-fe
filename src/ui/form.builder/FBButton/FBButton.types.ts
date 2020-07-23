import { ButtonProps } from "@material-ui/core";
import { FBInputProps } from "..";

export type FBButtonProps =
  & Pick<FBInputProps, "gutter">
  & Pick<ButtonProps,
    | "variant"
    | "color"
    | "size"
    | "fullWidth"
    | "onClick"
    | "startIcon"
    | "disabled"
    | "id"
    | "type"
    | "style"
    | "autoFocus"
    | "hidden"
    | "endIcon"
  >
  & {
    label?: string;
    dataCy?: string;
  };
