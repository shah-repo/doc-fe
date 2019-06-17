import * as React from "react";
import { FormattedDate } from "react-intl";
import moment from "moment";

type FormattedDateProps = FormattedDate.Props;

export interface DateFormatterProps extends Partial<FormattedDateProps> {
  value: Date | string | number | undefined;
}

const DateFormatter: React.FunctionComponent<DateFormatterProps> = ({
  value,
  ...props
}: DateFormatterProps) => {
  if (!value) return null;

  return <FormattedDate value={value} {...props} />;
};

export default DateFormatter;
