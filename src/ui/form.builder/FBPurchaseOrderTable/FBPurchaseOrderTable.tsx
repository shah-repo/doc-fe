import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FBButton, FBPurchaseOrderTableDetails, FBPurchaseOrderTableSum, FBPurchaseOrderTableTotal, FBSection, FBTableCell } from "..";
import { ReactComponent as PlusIcon } from "../../../assets/images/plus_icon_add_btn.svg";
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
  isReceivable,
  gutter,
}) => (
  <><FBSection
    name={`fb-approvals-section-${name}`}
    label="form.purchare.order.table.headline" /><Table className={classes?.root}>
    <TableBody>
      <TableRow>
        <FBTableCell colSpan={9}>
          <FBPurchaseOrderTableDetails {...{
            handleDelete, handleItem, classes, items, mode,
            loading, calculation, isReceivable,
          }} />
        </FBTableCell>
        <FBTableCell colSpan={1} style={{ verticalAlign: "baseline" }}>
          <FBPurchaseOrderTableSum {...{ handleItem, handleLot, classes, items, calculation, mode, isReceivable }} />
        </FBTableCell>
      </TableRow>
      {!disabled && (
        <TableRow>
          <FBTableCell colSpan={1}>
            <FBButton
              label="form.builder.add.line.item"
              onClick={() => handleItem && handleItem()}
              fullWidth
              showNewButton
              startIcon={<PlusIcon />}
              className={classes?.button}
              newVariant={true}
              {...{ disabled }} />
          </FBTableCell>
        </TableRow>
      )}
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
  </Table></>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
