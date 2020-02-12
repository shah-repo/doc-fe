import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Text from "../../../components/Text";

interface Props {
  values: any[];
}

const FBPurchaseOrderTotal: React.FunctionComponent<Props> = ({
  values,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    if (!values) {
      setTotalAmount(0);
      return;
    }

    const sum = values.reduce(
      (agg, value) =>
        agg + (
          Number(value.unitPrice || 0) *
          Number(value.order || 0)
        ), 0,
    );
    setTotalAmount((sum).toFixed(2));
  }, [values]);

  return (
    <Box margin="10px 0">
      <Typography variant="h5" align="right">
        <Text translation="form.builder.total.amount" values={{ totalAmount }} />
      </Typography>
    </Box>
  );
};

export default FBPurchaseOrderTotal;
