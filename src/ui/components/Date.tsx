import * as React from "react";
import { FormattedDate } from "react-intl";

type FormattedDateProps = FormattedDate.Props;

export interface DateProps extends FormattedDateProps {}

const Date: React.FunctionComponent<DateProps> = ({
  value,
  ...props
}: DateProps) => {
  if (!value) return null;

  return <FormattedDate value={value} {...props} />;
};

export default Date;
