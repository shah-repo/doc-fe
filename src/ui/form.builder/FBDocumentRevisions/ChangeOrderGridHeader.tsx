import {
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import useStyles from "./ChangeOrderGrid.styles";

import cx from "classnames";
import React from "react";
import Text from "../../components/Text";

const ChangeOrderGridHeader: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  return (
    <TableHead className={classes.tableHeadHeight}>
      <TableRow>
        <TableCell className={cx(classes.tableCell, classes.tableCellOne)} align="left">
          <Text translation="form.builder.document"/>
        </TableCell>
        <TableCell className={classes.tableCell} align="left">
          <span className={classes.verticalDivider}>
            <Text translation="form.builder.description.of.change"/>
          </span>
        </TableCell>
        <TableCell className={cx(classes.tableCell, classes.tableCellThree)} align="center">
          <span className={classes.verticalDivider}>
            <Text translation="form.builder.justification.of.change"/>
          </span>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ChangeOrderGridHeader;
