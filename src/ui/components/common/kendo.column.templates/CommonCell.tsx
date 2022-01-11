import { GridCellProps } from "@progress/kendo-react-grid";
import { get } from "lodash";
import React from "react";
import { getFormattedDateString, MomentFormats, toValidateIfDate } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";


export const CommonCell = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const value = get(dataItem, field || "");
  const toCheckIfDate = toValidateIfDate(value);
  const formattedValue = toCheckIfDate
    ? getFormattedDateString(value, MomentFormats.MonthDateYear)
    : value;
  if (rowType === "groupHeader") {
    return null;
  }
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip data={formattedValue}/>
    </td>
  );
};
