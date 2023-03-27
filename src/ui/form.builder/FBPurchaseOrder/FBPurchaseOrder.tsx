import { Box } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBButton, FBDialog, FBInput, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable } from "..";
import { FBButtonStyles } from "../styles/FBButton.styles";
import { FBPurchaseOrderStyles } from "./FBPurchaseOrder.styles";
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
  loading,
  disabled,
  isReceivable,
  name,
  isPO,
}) => {
  const classes = { ...FBButtonStyles(), ...FBPurchaseOrderStyles() };
  return (<FBProvider {...{ purchaseOrderState, dialogState }}>
    <FBDialog />
    <FBInput {...{ name, disabled }} type="purchaseorder">
      <Box mb={gutter ? 5 : 0}>
        <FBPurchaseOrderTable {...{ name, disabled, handleItem, handleLot, mode, isReceivable, gutter }} />
        {isReceivable && (
          <FBButton
            color="primary"
            label="form.builder.receive"
            onClick={handleReceiveAll}
            disabled={loading}
            className={cx(classes.button, classes.receiveAllBtn)}
          />
        )}
      </Box>
    </FBInput>
  </FBProvider>
  ); };

export default withFBPurchaseOrder(FBPurchaseOrder);
