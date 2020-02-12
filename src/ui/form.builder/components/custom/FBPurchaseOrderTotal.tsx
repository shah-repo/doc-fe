import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Text from "../../../components/Text";

interface Props {
  values: any[];
}

const TAX_RATE = 0.065;

const FBPurchaseOrderTotal: React.FunctionComponent<Props> = ({
  values,
}) => {
  const INITIAL_COST = { tax: 0, subTotal: 0 };
  const [cost, setCost] = useState(INITIAL_COST);
  useEffect(() => {
    if (!values) {
      setCost(INITIAL_COST);
      return;
    }

    const sum = values.reduce(
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
    setCost({
      subTotal: sum.subTotal.toFixed(2),
      tax: sum.tax.toFixed(2),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <Box margin="10px 0">
      <Typography variant="h5" align="right">
        <Text translation="form.builder.sub.total" values={{ subTotal: cost.subTotal }} />
      </Typography>
      <Typography variant="h5" align="right">
        <Text translation="form.builder.tax" values={{ tax: cost.tax }} />
      </Typography>
    </Box>
  );
};

export default FBPurchaseOrderTotal;
