import React from "react";
import { get } from "lodash";
import cx from "classnames";
import Cell from "../Cell";
import { GridCellProps } from "@progress/kendo-react-grid";
import useStyles from "./styles";

const ActiveCell: React.FC<GridCellProps> = (props) => {
  const { dataItem, field } = props;

  const classes = useStyles();

  const value = get(dataItem, field || "");

  return (
    <Cell {...props}>
      <div className={classes.status}>
        <div className={cx(classes.circle, { [classes.circleActive]: value })} />
        {value ? "Active" : "Inactive"}
      </div>
    </Cell>
  );
};

export default ActiveCell;
