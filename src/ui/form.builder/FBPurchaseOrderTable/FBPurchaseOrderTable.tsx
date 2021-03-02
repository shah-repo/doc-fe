import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FBPurchaseOrderTableDetails, FBPurchaseOrderTableSum, FBPurchaseOrderTableTotal, FBTableCell } from "..";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";

const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCost,
  handleCurrencyChange,
  handleDelete,
  handleItem,
  classes,
  calculation,
  disabled,
  items = [],
  loading,
  mode,
  name,
}) => (
  <Table className={classes?.root}>
    <TableHead>
      <TableRow>
        <FBTableCell colSpan={8} label="form.builder.details" />
        <FBTableCell colSpan={3} label="form.builder.field.ext.amount" align="right" />
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <FBTableCell colSpan={8}>
          <FBPurchaseOrderTableDetails {...{ handleDelete, handleItem, classes, items, mode, loading, calculation }} />
        </FBTableCell>
        <FBTableCell colSpan={3} style={{ verticalAlign: "baseline" }}>
          <FBPurchaseOrderTableSum {...{ handleItem, classes, items, calculation }} />
        </FBTableCell>
      </TableRow>
      {mode === "form" && (
        <FBPurchaseOrderTableTotal {...{ handleShippingCost, handleCurrencyChange, calculation, disabled, name }} />
      )}
    </TableBody>
  </Table>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
