import * as React from 'react';
import Moment, { MomentProps } from 'react-moment';
import { MomentFormats, useDate } from '../../common/utils/date';

interface DateTimeProps extends MomentProps {
  value: string
}

type Props = DateTimeProps;

const DateTime: React.FunctionComponent<Props> = ({
  value,
  format,
  ...other
}) => {
  const { timezone } = useDate();

  return (
    <Moment
      format={format || MomentFormats.DateTime}
      tz={timezone}
      {...other}
    >
      {value}
    </Moment>
  );
};

export default DateTime;
