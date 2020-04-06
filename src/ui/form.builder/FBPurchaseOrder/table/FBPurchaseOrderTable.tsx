import { Box, Checkbox, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import classNames from "classnames";
import React from "react";
import Date from "../../../components/Date"; // we shouldn't use anything outside the formbuilder
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import { FBPurchaseOrderTableProps, PurchaseOrderItem } from "../FBPurchaseOrder.types";
import FBPurchaseOrderDialog from "../form/FBPurchaseOrderDialog";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";

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

const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  items,
  disabled,
  handleEdit,
  handleDelete,
  isDialogOpen,
  closeDialog,
  initialValues,
  onSubmit,
  name,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Table className={classes.table} aria-label="purchase order table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Item</StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.qunatity.ordered" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.units" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.part.number" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.date.required" />
            </StyledTableCell>
            <StyledTableCell colSpan={6} padding="none">
              <Text message="form.builder.field.supplier.part.number" />
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
          {items.map((row: PurchaseOrderItem, index) => (
            <TableRow
              key={index}
              onClick={handleEdit(index, row)}
              className={classNames({ [classes.editable]: !disabled })}
            >
              <StyledTableCell align="left">{index + 1}</StyledTableCell>
              <StyledTableCell>{row.order}</StyledTableCell>
              <StyledTableCell>{row.units}</StyledTableCell>
              <StyledTableCell>{row.partNumber}</StyledTableCell>
              <StyledTableCell>
                <Date value={row.date} />
              </StyledTableCell>
              <StyledTableCell colSpan={6} padding="none">{row.description}</StyledTableCell>
              <StyledTableCell>${row.unitPrice}</StyledTableCell>
              <StyledTableCell>${row.totalAmount}</StyledTableCell>
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
      <FBPurchaseOrderDialog
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        initialValues={initialValues}
        onSubmit={onSubmit}
        name={name}
      />
    </Box>
  );
};

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
