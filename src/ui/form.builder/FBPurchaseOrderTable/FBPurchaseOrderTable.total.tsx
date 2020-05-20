import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FBPurchaseOrderTableTotalProps, FBTableCell, FBTextField } from "..";

const FBPurchaseOrderTableTotal: React.FunctionComponent<FBPurchaseOrderTableTotalProps> = ({
  handleShippingCost,
  calculation,
  disabled,
  name,
}) => (
  <React.Fragment>
    <TableRow>
      <FBTableCell rowSpan={4} colSpan={6} />
      <FBTableCell label="form.builder.sub.total" colSpan={4} className="FBTotal-root" />
      <FBTableCell label={`$${calculation?.subTotal}`} className="FBTotal-root" align="right" />
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.tax" className="FBTotal-root" colSpan={4} />
      <FBTableCell label={`$${calculation?.tax}`} className="FBTotal-root" align="right" />
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.shipping.cost" className="FBTotal-root" colSpan={3} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FBTextField
          name={`${name}.shippingCost`}
          gutter={false}
          type="number"
          size="small"
          inputProps={{
            style: { textAlign: "right", padding: "5px" },
            step: ".01",
          }}
          onChange={handleShippingCost}
          {...{ disabled }}
        />
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.total" className="FBTotal-root" colSpan={4} />
      <FBTableCell label={`$${calculation?.totalAmount}`} className="FBTotal-root" align="right" />
    </TableRow>
  </React.Fragment>
);

export default FBPurchaseOrderTableTotal;
