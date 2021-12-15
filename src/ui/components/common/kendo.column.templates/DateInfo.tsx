import { get } from "lodash";
import moment from "moment";
import React from "react";

export const DateInfo = (props) => {
  const date = get(props.dataItem, props.field);
  const formattedDate = date ? moment(date).format("MM/DD/YYYY") : null;
  if (props.rowType === "groupHeader") {
    return null;
  }
  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {formattedDate}
    </td>
  );
};
