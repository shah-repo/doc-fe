import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";

export const DateCompleted = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const intl = useIntl();
  const date = dataItem[field || ""];
  const formattedDate = date
    ? getFormattedDateString(date, MomentFormats.DateTimeComplete)
    : intl.formatMessage({ id: "common.pending" });
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
      {formattedDate && <Tooltip data={formattedDate} />}
    </td>
  );
};
