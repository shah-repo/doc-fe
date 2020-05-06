import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { FBMapWrapper, FBPOReceiveTableProps, PurchaseOrderItem } from "..";
import Date from "../../components/Date";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import { withFBPOReceiveTable } from "./FBPOReceiveTable.wrap";

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

const FBPOReceiveTable: React.FunctionComponent<FBPOReceiveTableProps> = ({
  items = [],
  handleEdit,
  disabled,
  receivedItems = {},
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} mb={4}>
      <Table className={classes.table} aria-label="purchase order table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Item</StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.ordered" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.received" />
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
          </TableRow>
        </TableHead>
        <TableBody>
          <FBMapWrapper<PurchaseOrderItem> collection={items}>
            {(item, index) => (
              <TableRow
                key={`fb-po-receive-${item.id}`}
                onClick={handleEdit && handleEdit(index, item)}
                className={classNames({ [classes.editable]: !disabled })}
              >
                <StyledTableCell align="left">{index + 1}</StyledTableCell>
                <StyledTableCell>{item.order}</StyledTableCell>
                <StyledTableCell>{receivedItems[item.partNumber] ?? 0}</StyledTableCell>
                <StyledTableCell>{item.units}</StyledTableCell>
                <StyledTableCell>{item.partNumberDocId}</StyledTableCell>
                <StyledTableCell>
                  <Date value={item.date} />
                </StyledTableCell>
                <StyledTableCell colSpan={6} padding="none">{item.description}</StyledTableCell>
                <StyledTableCell>${item.unitPrice}</StyledTableCell>
                <StyledTableCell>${item.totalAmount}</StyledTableCell>
              </TableRow>
            )}
          </FBMapWrapper>
        </TableBody>
      </Table>
    </Box>
  );
};

export default withFBPOReceiveTable(FBPOReceiveTable);
