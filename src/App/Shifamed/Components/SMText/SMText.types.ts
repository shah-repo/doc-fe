import { BoxProps } from '@material-ui/core';

export interface SMTextLocaleProps {
  locale: string;
  values: Record<string, string>;
}

export interface SMTextProps {
  label?: string | SMTextLocaleProps;
  boxProps?: BoxProps;
  loading?: boolean;
  dataCy?: string;
}
