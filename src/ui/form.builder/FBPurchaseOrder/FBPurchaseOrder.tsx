import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import FBSectionBox from "../components/layout/FBSectionBox";
import FBPurchaseOrderTotal from "./cost/FBPurchaseOrderTotal";
import { FBPurchaseOrderAddItemProps, FBPurchaseOrderFieldProps, FBPurchaseOrderTableProps, FBPurchaseOrderTotalProps } from "./FBPurchaseOrder.types";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";
import FBPurchaseOrderAddItem from "./form/FBPurchaseOrderAddItem";
import FBPurchaseOrderTable from "./table/FBPurchaseOrderTable";

const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderFieldProps> = ({
  poState,
  ...props
}) => (
  <Provider {...{ poState }}>
    <Box mt={3}>
      <FBSectionBox label={props.label} />
      <FBPurchaseOrderTable {...props as FBPurchaseOrderTableProps} />
      <FBPurchaseOrderAddItem {...props as FBPurchaseOrderAddItemProps} />
      <FBPurchaseOrderTotal {...props as FBPurchaseOrderTotalProps} />
    </Box>
  </Provider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
