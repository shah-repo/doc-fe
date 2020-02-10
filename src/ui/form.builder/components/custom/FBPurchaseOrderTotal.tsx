import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

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
          Number(value.price || 0) *
          Number(value.order || 0)
        ), 0,
    );
    setTotalAmount((sum).toFixed(2));
  }, [values]);

  return (
    <Typography variant="h5" align="right">
      Total amount: ${totalAmount}
    </Typography>
  );
};

export default FBPurchaseOrderTotal;
