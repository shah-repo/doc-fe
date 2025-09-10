import * as React from 'react';
import { FormatDateOptions, FormattedDate } from 'react-intl';
import { useDate } from '../../common/utils/date';

export interface DateFormatterProps extends Partial<FormatDateOptions> {
  value?: Date | string | number
}

const DateFormatter: React.FunctionComponent<DateFormatterProps> = ({
  value,
  ...props
}: DateFormatterProps) => {
  const { timezone } = useDate();

  if (!value) { return null; }

  return <FormattedDate value={value} timeZone={timezone} {...props} />;
};

export default DateFormatter;
