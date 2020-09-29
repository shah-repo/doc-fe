import * as React from "react";
import { FormatDateOptions, FormattedDate } from "react-intl";
import { TIME_ZONE } from "../../common/utils/date";

export interface DateFormatterProps extends Partial<FormatDateOptions> {
  value?: Date | string | number;
}

const DateFormatter: React.FunctionComponent<DateFormatterProps> = ({
  value,
  ...props
}: DateFormatterProps) => {
  if (!value) { return null; }

  return <FormattedDate value={value} timeZone={TIME_ZONE} {...props} />;
};

export default DateFormatter;
