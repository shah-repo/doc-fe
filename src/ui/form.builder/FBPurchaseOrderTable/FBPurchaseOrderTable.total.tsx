import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedNumber } from "react-intl";
import { FBPurchaseOrderTableTotalProps, FBTableCell, FBTextField } from "..";
import { FBSelect } from "../FBSelect";

const FBPurchaseOrderTableTotal: React.FunctionComponent<FBPurchaseOrderTableTotalProps> = ({
  handleShippingCost,
  handleCurrencyChange,
  calculation,
  disabled,
  name,
}) => (
  <React.Fragment>
    <TableRow>
      <FBTableCell rowSpan={4} colSpan={6} />
      <FBTableCell label="form.builder.currency" className="FBTotal-root" colSpan={2} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FBSelect
          name={`${name}.currency`}
          onChange={handleCurrencyChange}
          defaultValue="USD"
          optionLabelKey="text"
          optionValueKey="value"
          options={[
            { text: "USD $", value: "USD" },
            { text: "EUR €", value: "EUR" },
            { text: "GBP £", value: "GBP" },
          ]}
          {...{ disabled }}
        />
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.sub.total" colSpan={4} className="FBTotal-root" />
      <FBTableCell className="FBTotal-root" align="right">
        <FormattedNumber
          value={Number(calculation?.subTotal)}
          style="currency"
          currency="GBP"
          currencyDisplay="narrowSymbol"
        />
      </FBTableCell>
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
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.total" className="FBTotal-root" colSpan={4} />
      <FBTableCell label={`$${calculation?.totalAmount}`} className="FBTotal-root" align="right" />
    </TableRow>
  </React.Fragment>
);

export default FBPurchaseOrderTableTotal;
