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
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";

interface Props {
  values: any[];
  disabled: boolean;
  editItem: (index: number) => void;
  deleteItem: (index: number) => void;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: Colors.light_gray,
    color: theme.palette.common.black,
    textTransform: "uppercase",
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
  disabled,
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
        unitPrice: Number(value.unitPrice || 0).toFixed(2),
        amount: (Number(value.unitPrice || 0) * Number(value.order || 0)).toFixed(2),
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
            <StyledTableCell>
              <Text message="form.builder.field.order" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.units" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.pn" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.date" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.pn.description" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.unit.price" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.ext.amount" />
            </StyledTableCell>
            {
              !disabled &&
              <StyledTableCell padding="checkbox" align="center">
                <Text message="form.builder.field.tax" />
              </StyledTableCell>
            }
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {preCalc.map((row, index) => (
            <TableRow key={index} onClick={handleEdit(index)} className={classes.row}>
              <StyledTableCell align="left">{index + 1}</StyledTableCell>
              <StyledTableCell>{row.order}</StyledTableCell>
              <StyledTableCell>{row.units}</StyledTableCell>
              <StyledTableCell>{row.partNumber}</StyledTableCell>
              <StyledTableCell>
                <Date value={row.date} />
              </StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell>${row.unitPrice}</StyledTableCell>
              <StyledTableCell>${row.amount}</StyledTableCell>
              <StyledTableCell padding="checkbox" align="center">
                <Checkbox disabled checked={row.tax} />
              </StyledTableCell>
              {
                !disabled &&
                <StyledTableCell>
                  <RemoveCircleOutlineIcon color="error" onClick={handleDelete(index)} />
                </StyledTableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FBPurchaseOrderTable;
