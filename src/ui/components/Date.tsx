import * as React from "react";
import { FormatDateOptions, FormattedDate } from "react-intl";
import { toStartOfDay } from "../../common/utils/date";

export interface DateFormatterProps extends Partial<FormatDateOptions> {
  value?: Date | string | number;
}

const DateFormatter: React.FunctionComponent<DateFormatterProps> = ({
  value,
  ...props
}: DateFormatterProps) => {
  const formattedDate = React.useMemo(() => {
    if (!value) {
      return null;
    }

    return toStartOfDay(value);
  }, [value]);
  if (!formattedDate) { return null; }

  return <FormattedDate  value={formattedDate} {...props} />;
};

export default DateFormatter;
