import { Chip, Grid } from "@material-ui/core";
import React from "react";
import { statusClassMapping } from "../kendo/helpers";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";
import { styles } from "./Status.styles";

export const Status = (props: GridCellProperties) => {
  const classes = styles();
  const status = props.dataItem[props.field || ""];
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
        <Tooltip
          data={status}
          childrenElement={
            <Chip
              size="small"
              className={`${classes.chip} ${
                classes[statusClassMapping[status]]
              }`}
              label={status}
            />
          }
        />
      </Grid>
    </td>
  );
};
