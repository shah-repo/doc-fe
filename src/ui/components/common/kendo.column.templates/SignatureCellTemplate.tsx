import React from "react";
import { Chip, Grid } from "@material-ui/core";
import { get } from "lodash";
import Tooltip from "../kendo/Tooltip";
import { CustomGridCellProps } from "../kendo/types";
import { styles } from "./SignatureCellTemplate.styles";

export const SignatureCellTemplate = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const classes = styles();
  const values = get(dataItem, field || "");
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
        className={classes.container}
      >
        {values?.map((val) => (<Tooltip
          className={classes.chipContainer}
          data={val}
          showTooltip={true}
          childrenElement={
            <Chip
              size="small"
              className={classes.chip}
              label={val}
            />
          }
        />))}
      </Grid>
    </td>
  );
};
