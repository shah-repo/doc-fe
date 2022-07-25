import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBInput, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBSection } from "..";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";

const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderProps> = ({
  handleItem,
  handleLot,
  handleReceiveAll,
  purchaseOrderState,
  dialogState,
  gutter = true,
  mode = "form",
  label,
  disabled,
  isReceivable,
  name,
}) => (
  <FBProvider {...{ purchaseOrderState, dialogState }}>
    <FBDialog />
    <FBInput {...{ name, disabled }} type="purchaseorder">
      <Box mb={gutter ? 5 : 0}>
        {mode === "form" && <FBSection name={`fb-po-section-${name}`} {...{ label }}  />}
        <FBPurchaseOrderTable {...{ name, disabled, handleItem, handleLot, mode }} />
        {isReceivable && (
          <FBButton
            variant="outlined"
            color="primary"
            label="form.builder.receive"
            onClick={handleReceiveAll}
          />
        )}
        {!disabled && (
          // TODO remove inline styles and make add button consistent with other buttons
          <FBButton
            label="form.builder.add.item"
            onClick={() => handleItem && handleItem()}
            showNewButton
            fullWidth
            style={{
              marginTop: gutter ? 5 : 0,
              borderRadius: 0,
            }}
            {...{ disabled }}
          />
        )}
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
