import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBInput, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBSection } from "..";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";


const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderProps> = ({
  handleItem,
  handleLot,
  purchaseOrderState,
  dialogState,
  gutter = true,
  mode = "form",
  label,
  disabled,
  autosave,
  name,
}) => (
  <FBProvider {...{ purchaseOrderState, dialogState }}>
    <FBDialog />
    <FBInput {...{ name, disabled, autosave }} type="purchaseorder">
      <Box mb={gutter ? 5 : 0}>
        {mode === "form" && <FBSection name={`fb-po-section-${name}`} {...{ label }}  />}
        <FBPurchaseOrderTable {...{ name, disabled, handleItem, handleLot, mode }} />
        {!disabled && (
          <FBButton
            fullWidth={true}
            label="form.builder.add.item"
            onClick={() => handleItem && handleItem()}
            variant="outlined"
            style={{ margin: 0 }}
            {...{ disabled }}
          />
        )}
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
