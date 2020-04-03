import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";
import FBPurchaseOrderDialog from "./form/FBPurchaseOrderDialog";
import FBPurchaseOrderTable from "./table/FBPurchaseOrderTable";

const FBPurchaseOrder: React.FunctionComponent<any> = ({
  poState,
  name,
  disabled,
  ...props
}) => {
  console.log(poState);
  return (
    <Provider {...{ poState }}>
      <Box mb={3}>
        <FBPurchaseOrderTable
          poState={poState}
          disabled={disabled}
        />
        <FBPurchaseOrderDialog
          poState={poState}
          disabled={disabled}
        />
      </Box>
    </Provider>
  );
};

export default withFBPurchaseOrder(FBPurchaseOrder);
