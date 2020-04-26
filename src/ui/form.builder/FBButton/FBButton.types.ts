import { ButtonProps } from "@material-ui/core";

export type FBButtonProps = Pick<
ButtonProps,
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
> & {
  label?: string;
};
