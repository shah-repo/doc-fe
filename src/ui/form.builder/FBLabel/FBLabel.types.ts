import { SvgIconProps } from "@material-ui/core";
import { FormControlProps } from "@material-ui/core/FormControl";
import { ReactNode } from "react";
import { Props } from "react-intl/lib/components/message";

export interface FBLabelLocaleProps {
  locale: string;
  values: Props["values"];
}

export type FBLabelProps =
  & Pick<FormControlProps, "error">
  & {
    label?: string | ReactNode | FBLabelLocaleProps;
    fontSize?: string | SvgIconProps["fontSize"] | "sm" | "md" | "lg";
    loading?: boolean;
  };

export enum FBLabelFontSize {
  sm = "caption",
  md = "subtitle1",
  lg = "h6",
}
