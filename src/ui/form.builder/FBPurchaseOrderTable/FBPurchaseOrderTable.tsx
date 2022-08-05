import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FBPurchaseOrderTableDetails, FBPurchaseOrderTableSum, FBPurchaseOrderTableTotal, FBTableCell } from "..";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";

const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCostChange,
  handleTaxChange,
  handleTaxRateChange,
  handleCurrencyChange,
  handleDelete,
  handleItem,
  handleLot,
  reCalculateValueOnBlur,
  classes,
  calculation,
  disabled,
  items = [],
  loading,
  mode,
  name,
}) => (
  <Table className={classes?.root}>
    {/* Commenting as per design */}
    {/* <TableHead>
       <TableRow>
        <FBTableCell
          colSpan={8}
          label={mode === "form" ? "form.builder.details" : "form.builder.select.line.to.receive.against"}
        />
        <FBTableCell colSpan={3} label={mode === "form" ? "form.builder.field.ext.amount" : ""} align="right" />
      </TableRow>
    </TableHead>*/}
    <TableBody>
      <TableRow>
        <FBTableCell colSpan={9}>
          <FBPurchaseOrderTableDetails {...{ handleDelete, handleItem, classes, items, mode, loading, calculation }} />
        </FBTableCell>
        <FBTableCell colSpan={1} style={{ verticalAlign: "baseline" }}>
          <FBPurchaseOrderTableSum {...{ handleItem, handleLot, classes, items, calculation, mode }} />
        </FBTableCell>
      </TableRow>
      {mode === "form" && (
        <FBPurchaseOrderTableTotal {...{
          handleShippingCostChange,
          handleTaxChange,
          handleTaxRateChange,
          handleCurrencyChange,
          reCalculateValueOnBlur,
          calculation,
          disabled,
          name,
        }} />
      )}
    </TableBody>
  </Table>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
