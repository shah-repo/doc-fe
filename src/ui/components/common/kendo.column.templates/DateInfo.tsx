import { get } from "lodash";
import moment from "moment";
import React from "react";
import { MomentFormats, TIME_ZONE } from "../../../../common/utils/date";
import { GridCellProperties } from "../kendo/types";

export const DateInfo = (props: GridCellProperties) => {
  const date = get(props.dataItem, props.field || "");
  const formattedDate = date ? moment(date).tz(TIME_ZONE).format(MomentFormats.MonthDateYear) : null;
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
      {formattedDate}
    </td>
  );
};
