import { get } from "lodash";
import moment from "moment";
import React from "react";
import { toValidateIfDate } from "../../../../common/utils/date";

export const CommonCell = (props) => {
  const value = get(props.dataItem, props.field);
  // To check if value is date
  const toCheckIfDate = toValidateIfDate(value);
  const formattedValue = toCheckIfDate
    ? moment(value).format("MM/DD/YYYY")
    : value;
  if (props.rowType === "groupHeader") {
    return null;
  }
  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {formattedValue}
    </td>
  );
};
