import { SelectProps } from "@material-ui/core/Select/Select";
import { FBInputProps, FBOptionProps } from "../common";
import { FBFormikFieldProps } from "../formik";

export type FBSelectProps =
  & Pick<SelectProps, "variant">
  & Omit<FBFormikFieldProps, "name">
  & FBOptionProps
  & FBInputProps
  & {
    menuItems?: React.ReactNode[];
    showNote?: boolean;
  };
