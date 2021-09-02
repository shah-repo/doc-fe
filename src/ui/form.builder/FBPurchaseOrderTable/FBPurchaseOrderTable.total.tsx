import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedNumber } from "react-intl";
import { FBData, FBSelect, FBTableCell, FBTextField } from "..";
import { FormContext } from "../../components/forms/FormContext";
import FBPurchaseOrderExchange from "./FBPurchaseOrder.exchange";
import { FBPurchaseOrderTableTotalProps } from "./FBPurchaseOrderTable.types";

// TODO: update label of FBTableCell ("form.builder.tax.field") to ("form.builder.tax")

const FBPurchaseOrderTableTotal: React.FunctionComponent<FBPurchaseOrderTableTotalProps> = ({
  handleShippingCostChange,
  handleShippingCostBlur,
  handleTaxRateChange,
  handleTaxRateBlur,
  handleTaxChange,
  handleTaxBlur,
  handleCurrencyChange,
  calculation,
  handleTaxFieldChange,
  handleTaxFieldBlur,
  taxField,
  disabled,
  name,
}) => (
  <React.Fragment>
    <TableRow>
      <FBTableCell rowSpan={7} colSpan={6} />
      <FBTableCell label="form.builder.currency" className="FBTotal-root" colSpan={3} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FormContext.Provider value={{ submitOnChange: false }}>
          <FBSelect
            name={`${name}.currency`}
            onChange={handleCurrencyChange}
            options={FBData.currencyOptions}
            gutter={false}
            SelectDisplayProps={{ style: { padding: "5px 30px 5px 2px" } }}
            {...{ disabled }}
          />
        </ FormContext.Provider>
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.subTotal" colSpan={3} className="FBTotal-root" />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FormattedNumber
          value={Number(calculation?.subTotal)}
          // eslint-disable-next-line react/style-prop-object
          style="currency"
          currency={calculation?.currency}
        />
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.tax.rate" className="FBTotal-root" colSpan={3} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FBTextField
          name={`${name}.taxRate`}
          type="number"
          gutter={false}
          size="small"
          value={calculation?.taxRate}
          inputProps={{
            style: { textAlign: "right", padding: "5px" },
            step: ".01",
            min: "0",
            onChange: handleTaxRateChange,
            onBlur: handleTaxRateBlur,
          }}
          rules="min:0"
          {...{ disabled }}
        />
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.tax" className="FBTotal-root" colSpan={3} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FBTextField
          name={`${name}.tax`}
          gutter={false}
          type="number"
          size="small"
          value={calculation?.tax}
          inputProps={{
            style: { textAlign: "right", padding: "5px" },
            step: ".01",
            min: "0",
            onChange: handleTaxChange,
            onBlur: handleTaxBlur,
          }}
          rules="min:0"
          {...{ disabled }}
        />
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.tax.field" className="FBTotal-root" colSpan={3} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2}>
        <FBTextField
          name={`${name}.tax.field`}
          gutter={false}
          size="small"
          value={taxField}
          inputProps={{
            style: { textAlign: "right", padding: "5px 20px 5px 5px" },
            onChange: handleTaxFieldChange,
            onBlur: handleTaxFieldBlur,
          }}
          rules="min:0"
          {...{ disabled }}
        />
      </FBTableCell>
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
            min: "0",
            onChange: handleShippingCostChange,
            onBlur: handleShippingCostBlur,
          }}
          rules="min:0"
          {...{ disabled }}
        />
      </FBTableCell>
    </TableRow>
    <TableRow>
      <FBTableCell label="form.builder.total" className="FBTotal-root" colSpan={3} />
      <FBTableCell className="FBTotal-root" align="right" colSpan={2} data-cy="poTotal">
        <FormattedNumber
          value={Number(calculation?.totalAmount)}
          // eslint-disable-next-line react/style-prop-object
          style="currency"
          currency={calculation?.currency}
        />
      </FBTableCell>
    </TableRow>
    {
      calculation?.currency !== "USD" &&
      <TableRow>
        <FBTableCell colSpan={5} className="FBTotal-root" align="right">
          <FBPurchaseOrderExchange {...{ calculation }} />
        </FBTableCell>
      </TableRow>
    }
  </React.Fragment>
);

export default FBPurchaseOrderTableTotal;
