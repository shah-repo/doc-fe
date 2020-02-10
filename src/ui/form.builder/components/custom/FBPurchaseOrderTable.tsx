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
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React, { useEffect, useState } from "react";
import Date from "../../../components/Date"; // we shouldn't use anything outside the formbuilder
import Colors from "../../../layout/theme/utils/colors";

interface Props {
  values: any[];
  editItem: (index: number) => void;
  deleteItem: (index: number) => void;
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
  row: {
    cursor: "pointer",
  },
});

const FBPurchaseOrderTable: React.FunctionComponent<Props> = ({
  values,
  editItem,
  deleteItem,
}) => {
  const classes = useStyles();
  const handleEdit = (index) => () => editItem(index);
  const handleDelete = (index) => (e) => {
    e.stopPropagation();
    deleteItem(index);
  };
  const [preCalc, setPreCalc] = useState<any[]>([]);
  useEffect(() => {
    if (!values) {
      return;
    }

    const preCalcValues = values.map((value) => {
      return {
        ...value,
        price: Number(value.price || 0).toFixed(2),
        amount: (Number(value.price || 0) * Number(value.order || 0)).toFixed(2),
      };
    });

    setPreCalc(preCalcValues);
  }, [values]);

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
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {preCalc.map((row, index) => (
            <TableRow key={index} onClick={handleEdit(index)} className={classes.row}>
              <StyledTableCell align="left">{index + 1}</StyledTableCell>
              <StyledTableCell>{row.order}</StyledTableCell>
              <StyledTableCell>{row.units}</StyledTableCell>
              <StyledTableCell>
                <Date value={row.date} />
              </StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell>${row.price}</StyledTableCell>
              <StyledTableCell>${row.amount}</StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                <Checkbox disabled checked={row.tax} />
              </StyledTableCell>
              <StyledTableCell>
                <RemoveCircleOutlineIcon color="error" onClick={handleDelete(index)} />
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FBPurchaseOrderTable;
