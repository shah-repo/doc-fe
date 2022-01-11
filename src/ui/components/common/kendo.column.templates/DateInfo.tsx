import { Grid } from "@material-ui/core";
import { get } from "lodash";
import React from "react";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";

export const DateInfo = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProperties) => {
  const date = get(dataItem, field || "");
  const formattedDate = date ? getFormattedDateString(date, MomentFormats.MonthDateYear) : null;
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
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
      >
        {formattedDate && <Tooltip data={formattedDate} />}
      </Grid>
    </td>
  );
};
