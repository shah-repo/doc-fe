import {
  Box,
  Checkbox,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";

interface Props {
  values: any[];
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: Colors.light_gray,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
});

const FBPurchaseOrderTable: React.FunctionComponent<Props> = ({
  values,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Table className={classes.table} aria-label="purchase order table">
        <TableHead>
          <TableRow>
            <StyledTableCell size="small" align="left">Item</StyledTableCell>
            <StyledTableCell>Order</StyledTableCell>
            <StyledTableCell>Units</StyledTableCell>
            <StyledTableCell>PN/Date Required</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Ext. Amount</StyledTableCell>
            <StyledTableCell padding="checkbox" align="center">Tax</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((row, index) => (
            <TableRow key={index}>
              <StyledTableCell align="left">{index + 1}</StyledTableCell>
              <StyledTableCell>{row.order}</StyledTableCell>
              <StyledTableCell>{row.units}</StyledTableCell>
              <StyledTableCell>{row.date}</StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell>${row.price}</StyledTableCell>
              <StyledTableCell>${row.price * row.order}</StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                <Checkbox disabled checked={row.tax} />
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FBPurchaseOrderTable;
