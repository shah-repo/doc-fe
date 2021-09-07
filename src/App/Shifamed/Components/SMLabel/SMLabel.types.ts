import { FormControlProps } from "@material-ui/core/FormControl";
import { Props } from "react-intl/lib/components/message";

interface SMLabelLocaleProps {
  locale: string;
  values: Props["values"];
}

export type SMLabelProps =
& Pick<FormControlProps, "error">
& {
  label?: string | SMLabelLocaleProps;
  fontSize?: SMLabelFontSize;
  loading?: boolean;
};

export enum SMLabelFontSize {
  sm = "caption",
  md = "subtitle1",
  lg = "h6",
}
