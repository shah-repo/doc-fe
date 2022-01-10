import { get } from "lodash";
import React from "react";
import { getFormattedDateString, MomentFormats, toValidateIfDate } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";


export const CommonCell = (props: GridCellProperties) => {
  const value = get(props.dataItem, props.field || "");
  // To check if value is date
  const toCheckIfDate = toValidateIfDate(value);
  const formattedValue = toCheckIfDate
    ? getFormattedDateString(value, MomentFormats.MonthDateYear)
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
      <Tooltip data={formattedValue}/>
    </td>
  );
};
