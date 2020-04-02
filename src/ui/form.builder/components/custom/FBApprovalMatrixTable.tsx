import { Box, Checkbox, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import classNames from "classnames";
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
  root: {
    padding: "8px",
    maxWidth: "100%",
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
  editable: {
    cursor: "pointer",
  },
});

const FBApprovalMatrixTable: React.FunctionComponent<Props> = ({
  values,
  editItem,
  deleteItem,
  disabled,
}) => {
  const classes = useStyles();
  const handleEdit = (index) => () => !disabled && editItem(index);
  const handleDelete = (index) => (e) => {
    e.stopPropagation();
    !disabled && deleteItem(index);
  };
  const [preCalc, setPreCalc] = useState<any[]>([]);
  useEffect(() => {
    if (!values) {
      return;
    }

    const preCalcValues = values.map((value) => ({
      ...value,
      unitPrice: Number(value.unitPrice || 0).toFixed(2),
      amount: (Number(value.unitPrice || 0) * Number(value.order || 0)).toFixed(2),
    }));

    setPreCalc(preCalcValues);
  }, [values]);

  return (
    <Box className={classes.root}>
      <Table className={classes.table} aria-label="purchase order table">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Text message="form.builder.field.prefix" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.internal.type" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.document.type" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.training.required" />
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
            <TableRow
              key={index}
              onClick={handleEdit(index)}
              className={classNames({ [classes.editable]: !disabled })}
            >
              <StyledTableCell align="left" onClick={handleEdit(index)}>{index + 1}</StyledTableCell>
              <StyledTableCell>{row.order}</StyledTableCell>
              <StyledTableCell>{row.units}</StyledTableCell>
              <StyledTableCell>{row.partNumber}</StyledTableCell>
              <StyledTableCell>
                <Date value={row.date} />
              </StyledTableCell>
              <StyledTableCell colSpan={6} padding="none">{row.description}</StyledTableCell>
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

export default FBApprovalMatrixTable;
