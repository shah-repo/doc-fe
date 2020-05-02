/* eslint-disable react/style-prop-object */
import { Box, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { FormattedNumber } from "react-intl";
import Text from "../../../components/Text";
import { FBPurchaseOrderTotalProps } from "../FBPurchaseOrder.types";
import { withFBPurchaseOrderTotal } from "./FBPurschaseOrderTotal.wrap";

const FBPurchaseOrderTotal: React.FunctionComponent<FBPurchaseOrderTotalProps> = ({
  shippingCost,
  disabled,
  setShippingCost,
  subTotal,
  tax,
  totalAmount,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const handleChange = (e) => {
    const { value } = e.target;
    setShippingCost(value);
  };

  useEffect(() => {
    if (inputEl && inputEl.current && shippingCost) {
      inputEl.current.value = shippingCost as unknown as string;
    }
  }, [inputEl, shippingCost]);

  const renderCost = (translation: string, value: string) => (
    <Box margin="5px 0">
      <Typography variant="h5" align="right">
        <Box minWidth="150px" component="span">
          <Text message={translation} />
        </Box>
        <Box minWidth="150px" component="span">
          <FormattedNumber value={value as unknown as number} style="currency" currency="USD" />
        </Box>
      </Typography>
    </Box>
  );
  const renderShippingCost = (
    <Box display="flex" alignItems="flex-end" justifyContent="flex-end" margin="5px 0 10px 0">
      <Typography variant="h5">
        <Text translation="form.builder.shipping.cost" />
      </Typography>
      <Box marginLeft="10px" maxWidth="60px">
        <TextField
          disabled={disabled}
          inputRef={inputEl}
          onChange={handleChange}
          type="number"
          size="small"
          inputProps={{
            style: { textAlign: "right", fontSize: 16, padding: 0 },
            step: ".01",
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box margin="10px 0">
      {renderCost("form.builder.sub.total", subTotal)}
      {renderCost("form.builder.tax", tax)}
      {renderShippingCost}
      {renderCost("form.builder.total", totalAmount)}
    </Box>
  );
};

export default withFBPurchaseOrderTotal(FBPurchaseOrderTotal);
