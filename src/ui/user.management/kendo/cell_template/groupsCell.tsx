import { Typography } from "@material-ui/core";
import React from "react";
import KendoGridStyles from "../kendogrid.styles";

export const GroupsCell = (props) => {
  const classes = KendoGridStyles();
  const groups = props.dataItem[props.field]?.map((emp) => emp.name).join(", ");

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
      className={classes.groupCell}
    >
      <Typography
        noWrap={false}
        component="span"
        gutterBottom
        className={`${classes.groupCell} ${classes.kGridFont}`}
      >
        {groups}
      </Typography>
    </td>
  );
};
