import React from "react";
import { FBButton, FBDialog, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBPurchaseOrderTotal, FBSection } from "..";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";


const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderProps> = ({
  handleAddItem,
  purchaseOrderState,
  dialogState,
  label,
  disabled,
  ...props
}) => (
  <FBProvider {...{ purchaseOrderState, dialogState }}>
    <FBDialog />
    <FBSection {...{ label }}  />
    <FBPurchaseOrderTable />
    <FBButton
      fullWidth={true}
      // disabled={disabled}
      label="form.builder.add.item"
      onClick={handleAddItem}
      variant="outlined"
      style={{ margin: 0 }}
    />
    <FBPurchaseOrderTotal />
  </FBProvider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
