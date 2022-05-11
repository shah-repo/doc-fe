import { BoxProps } from "@material-ui/core";
import { Translation } from "../../translations/types";

export interface SummaryBaseProps {
  label?: Translation | string;
  value?: any;
  noValueOption?: any;
  labelProps?: BoxProps;
  labelFont?: BoxProps;
}
