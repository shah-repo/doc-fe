import React from "react";
import { get } from "lodash";
import cx from "classnames";
import Cell from "../Cell";
import useStyles from "./styles";
import { CellProps } from "../../types";

const ActiveCell: React.FC<CellProps> = (props) => {
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
