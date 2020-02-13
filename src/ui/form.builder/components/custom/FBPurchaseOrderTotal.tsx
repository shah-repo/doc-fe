/* eslint-disable react/style-prop-object */
import { Box, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { FormattedNumber } from "react-intl";
import Text from "../../../components/Text";
import FBStore from "../../stores/ui/FBStore";
import { PurchaseOrder } from "../inputs/FBPurchaseOrderField";

interface Props {
  values: PurchaseOrder;
  name: string;
}

const TAX_RATE = 0.065;

const FBPurchaseOrderTotal: React.FunctionComponent<Props> = ({
  values,
  name,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const INITIAL_COST = { tax: 0, subTotal: 0 };
  const [cost, setCost] = useState(INITIAL_COST);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(values.shippingCost || 0);
  const handleChange = (e) => {
    const storeValues = FBStore.getValues();
    const { value } = e.target;
    FBStore.setValues({
      ...storeValues,
      [name]: {
        ...storeValues[name],
        shippingCost: value,
      },
    });
    setShippingCost(value);
  };

  useEffect(() => {
    if (inputEl && inputEl.current && values.shippingCost) {
      inputEl.current.value = values.shippingCost as unknown as string;
    }
  }, [inputEl, values.shippingCost]);

  useEffect(() => {
    const total = cost.subTotal + cost.tax + Number(shippingCost || 0);
    setTotalAmount(total);
  }, [cost, shippingCost]);
  useEffect(() => {
    if (!values.items) {
      setCost(INITIAL_COST);
      return;
    }

    const sum = values.items.reduce(
      (agg, value) => {
        const orderCost = Number(value.unitPrice || 0) * Number(value.order || 0);
        const subTotal = agg.subTotal + orderCost;

        let tax = agg.tax;

        if (value.tax) {
          tax += orderCost * TAX_RATE;
        }

        return { subTotal, tax };
      }, { tax: 0, subTotal: 0 },
    );
    setCost(sum);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const renderCost = (translation: string, value: number) => (
    <Box margin="5px 0">
      <Typography variant="h5" align="right">
        <Box minWidth="150px" component="span">
          <Text message={translation} />
        </Box>
        <Box minWidth="150px" component="span">
          <FormattedNumber value={value} style="currency" currency="USD" />
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
      {renderCost("form.builder.sub.total", cost.subTotal)}
      {renderCost("form.builder.tax", cost.tax)}
      {renderShippingCost}
      {renderCost("form.builder.total", totalAmount)}
    </Box>
  );
};

export default FBPurchaseOrderTotal;
