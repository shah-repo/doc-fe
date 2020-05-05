import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FBPurchaseOrderTableDetails, FBPurchaseOrderTableProps, FBPurchaseOrderTableSum, FBTextField } from "..";
import Text from "../../components/Text";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";

const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCost,
  handleDelete,
  handleItem,
  classes,
  calculation,
  disabled,
  items = [],
  name,
}) => (
  <Table className={classes?.root}>
    <TableHead>
      <TableRow>
        <TableCell colSpan={3}><Text message="form.builder.details" /></TableCell>
        <TableCell colSpan={2} align="right" className="FBAmount-root">
          <Text message="form.builder.field.ext.amount" />
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={3}>
          <FBPurchaseOrderTableDetails {...{ handleDelete, handleItem, classes, items }} />
        </TableCell>
        <TableCell colSpan={2}>
          <FBPurchaseOrderTableSum {...{ handleItem, classes, items }} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={4} />
        <TableCell rowSpan={4} />
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.sub.total" /></TableCell>
        <TableCell className="FBTotal-root" align="right">${calculation?.subTotal}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.tax" /></TableCell>
        <TableCell className="FBTotal-root" align="right">${calculation?.tax}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.shipping.cost" /></TableCell>
        <TableCell className="FBTotal-root" align="right">
          <FBTextField
            name={`${name}.shippingCost`}
            gutter={false}
            variant="standard"
            type="number"
            size="small"
            inputProps={{
              style: { textAlign: "right", padding: "5px" },
              step: ".01",
            }}
            onChange={handleShippingCost}
            {...{ disabled }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.total" /></TableCell>
        <TableCell className="FBTotal-root" align="right">${calculation?.totalAmount}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
