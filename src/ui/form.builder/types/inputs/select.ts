import { SelectProps } from "@material-ui/core/Select/Select";
import { FBInputProps, FBOptionProps } from "../common";

export type FBSelectProps =
  & Pick<SelectProps, "variant">
  & FBOptionProps
  & FBInputProps
  & {
    menuItems?: React.ReactNode[];
    showNote?: boolean;
  };
