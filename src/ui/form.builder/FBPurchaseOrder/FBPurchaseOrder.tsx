import React from "react";
import { FBButton, FBPurchaseOrderProps, FBPurchaseOrderTable, FBPurchaseOrderTotal, FBSection } from "..";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";


const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderProps> = ({
  handleAddItem,
  label,
  disabled,
  ...props
}) => (
  <>
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
  </>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
