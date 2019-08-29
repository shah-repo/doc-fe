import * as React from "react";
import Moment, { MomentProps } from "react-moment";

export interface DateTimeProps extends MomentProps {
  value: string;
}

type Props = DateTimeProps;

export const DateTime: React.FunctionComponent<Props> = ({
  value,
  format,
  ...other
}) => (
  <Moment format={format || "MMMM Do YYYY h:mm a"} {...other}>
    {value}
  </Moment>
);

export default DateTime;
