import { BoxProps } from "@material-ui/core";
import { Props } from "react-intl/lib/components/message";

export interface SMTextLocaleProps {
  locale: string;
  values: Props["values"];
}

export interface SMTextProps {
  locale?: string | SMTextLocaleProps;
  boxProps?: BoxProps;
  loading?: boolean;
  dataCy?: string;
}
