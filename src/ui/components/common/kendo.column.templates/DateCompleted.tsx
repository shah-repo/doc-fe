import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { MomentFormats, TIME_ZONE } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";

export const DateCompleted = (props: GridCellProperties) => {
  const intl = useIntl();
  const date = props.dataItem[props.field || ""];
  const formattedDate = date
    ? moment(date).tz(TIME_ZONE).format(MomentFormats.DateTimeComplete)
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
