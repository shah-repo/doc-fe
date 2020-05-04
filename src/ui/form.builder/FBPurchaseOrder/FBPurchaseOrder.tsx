import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBSection } from "..";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";


const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderProps> = ({
  handleAddItem,
  purchaseOrderState,
  dialogState,
  label,
  disabled,
  gutter = true,
  name,
}) => (
  <FBProvider {...{ purchaseOrderState, dialogState }}>
    <FBDialog />
    <Box mb={gutter ? 5 : 0}>
      <FBSection {...{ label }}  />
      <FBPurchaseOrderTable {...{ name, disabled }} />
      <FBButton
        fullWidth={true}
        disabled={disabled}
        label="form.builder.add.item"
        onClick={handleAddItem}
        variant="outlined"
        style={{ margin: 0 }}
      />
    </Box>
  </FBProvider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
