import { BoxProps } from "@material-ui/core";
import { Props } from "react-intl/lib/components/message";

export type FBTextProps =
& Pick<Props, "values">
& {
  locale?: string;
  boxProps?: BoxProps;
  loading?: boolean;
};
