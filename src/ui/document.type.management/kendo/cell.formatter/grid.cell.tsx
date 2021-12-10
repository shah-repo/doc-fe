import { get } from "lodash";
import React from "react";
import GridCellStyles from "./grid.cell.styles";

export const CellFormatter = (props) => {
  if (props.rowType === "groupHeader") {
    return null;
  }
  const classes = GridCellStyles();
  const formattedValue = get(props.dataItem, props.field) ? "Active" : "Inactive";
  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>

      <div className={classes.topButton}>
        <span className={`${classes.dot} ${classes[formattedValue]}`}></span>
        <p className={classes.value}>{formattedValue}</p>
      </div>
    </td>
  );
};
