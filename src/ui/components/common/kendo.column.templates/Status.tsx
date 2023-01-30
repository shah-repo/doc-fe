import { Chip, Grid } from "@material-ui/core";
import React from "react";
import { POStatusLabelMapping } from "../../../../state/ducks/documentRevisions/types";
import { KendoGridFilterCell } from "../../KendoGrid/interfaces";
import { statusClassMapping } from "../kendo/helpers";
import Tooltip from "../kendo/Tooltip";
import { CustomGridCellProps } from "../kendo/types";
import { styles } from "./Status.styles";

export const Status = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const classes = styles();
  const status = dataItem[field || ""];
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };
  let fieldLabel = status;
  if (field === KendoGridFilterCell.PO_STATUS) {
    fieldLabel = POStatusLabelMapping[status];
  }
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
      >
        <Tooltip
          data={fieldLabel}
          childrenElement={
            <Chip
              size="small"
              className={`${classes.chip} ${
                classes[statusClassMapping[status]]
              }`}
              label={fieldLabel}
            />
          }
        />
      </Grid>
    </td>
  );
};
