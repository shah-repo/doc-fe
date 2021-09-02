import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FBPurchaseOrderTableDetails, FBPurchaseOrderTableSum, FBPurchaseOrderTableTotal, FBTableCell } from "..";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";

const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCostChange,
  handleShippingCostBlur,
  handleTaxRateChange,
  handleTaxRateBlur,
  handleTaxChange,
  handleTaxBlur,
  handleTaxFieldChange,
  handleTaxFieldBlur,
  handleCurrencyChange,
  handleDelete,
  handleItem,
  handleLot,
  classes,
  calculation,
  taxField,
  disabled,
  items = [],
  loading,
  mode,
  name,
}) => (
  <Table className={classes?.root}>
    <TableHead>
      <TableRow>
        <FBTableCell
          colSpan={8}
          label={mode === "form" ? "form.builder.details" : "form.builder.select.line.to.receive.against"}
        />
        <FBTableCell colSpan={3} label={mode === "form" ? "form.builder.field.ext.amount" : ""} align="right" />
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <FBTableCell colSpan={8}>
          <FBPurchaseOrderTableDetails {...{ handleDelete, handleItem, classes, items, mode, loading, calculation }} />
        </FBTableCell>
        <FBTableCell colSpan={3} style={{ verticalAlign: "baseline" }}>
          <FBPurchaseOrderTableSum {...{ handleItem, handleLot, classes, items, calculation, mode }} />
        </FBTableCell>
      </TableRow>
      {mode === "form" && (
        <FBPurchaseOrderTableTotal {...{
          handleShippingCostChange,
          handleShippingCostBlur,
          handleTaxRateChange,
          handleTaxRateBlur,
          handleTaxFieldChange,
          handleTaxFieldBlur,
          handleTaxChange,
          handleTaxBlur,
          handleCurrencyChange,
          calculation,
          taxField,
          disabled,
          name,
        }} />
      )}
    </TableBody>
  </Table>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
