import React from "react";
import { useIntl } from "react-intl";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";

export const DateCompleted = (props: GridCellProperties) => {
  const intl = useIntl();
  const date = props.dataItem[props.field || ""];
  const formattedDate = date
    ? getFormattedDateString(date, MomentFormats.DateTimeComplete)
    : intl.formatMessage({ id: "common.pending" });
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
      {formattedDate && <Tooltip data={formattedDate} />}
    </td>
  );
};
