import { Chip, Grid } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { statusClassMapping } from "../kendo/helpers";
import Tooltip from "../kendo/Tooltip";
import { styles } from "./Status.styles";

export const Status = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const classes = styles();
  const status = dataItem[field || ""];
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
