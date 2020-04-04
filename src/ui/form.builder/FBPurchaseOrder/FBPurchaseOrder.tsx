import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import FBPurchaseOrderTotal from "./cost/FBPurchaseOrderTotal";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";
import FBPurchaseOrderDialog from "./form/FBPurchaseOrderDialog";
import FBPurchaseOrderTable from "./table/FBPurchaseOrderTable";

const FBPurchaseOrder: React.FunctionComponent<any> = ({
  poState,
  name,
  ...props
}) => {
  console.log(poState);
  return (
    <Provider {...{ poState }}>
      <Box mb={3}>
        <FBPurchaseOrderTable {...props} />
        <FBPurchaseOrderDialog {...props} />
        <FBPurchaseOrderTotal {...props} />
      </Box>
    </Provider>
  );
};

export default withFBPurchaseOrder(FBPurchaseOrder);
