import * as React from "react";
import { FormattedDate } from "react-intl";

type FormattedDateProps = typeof FormattedDate;

export interface DateFormatterProps extends Partial<FormattedDateProps> {
  value?: Date | string | number;
}

const DateFormatter: React.FunctionComponent<DateFormatterProps> = ({
  value,
  ...props
}: DateFormatterProps) => {
  if (!value) { return null; }

  return <FormattedDate value={value} {...props} />;
};

export default DateFormatter;
