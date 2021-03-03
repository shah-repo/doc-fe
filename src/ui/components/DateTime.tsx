import * as React from "react";
import Moment, { MomentProps } from "react-moment";
import { TIME_ZONE } from "../../common/utils/date";

interface DateTimeProps extends MomentProps {
  value: string;
}

type Props = DateTimeProps;

const DateTime: React.FunctionComponent<Props> = ({
  value,
  format,
  ...other
}) => (
  <Moment
    format={format || "LLL"}
    tz={TIME_ZONE}
    {...other}
  >
    {value}
  </Moment>
);

export default DateTime;
