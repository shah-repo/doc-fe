import { Grid } from "@material-ui/core";
import { get } from "lodash";
import React from "react";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";

export const DateInfo = (props: GridCellProperties) => {
  const date = get(props.dataItem, props.field || "");
  const formattedDate = date ? getFormattedDateString(date, MomentFormats.MonthDateYear) : null;
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
