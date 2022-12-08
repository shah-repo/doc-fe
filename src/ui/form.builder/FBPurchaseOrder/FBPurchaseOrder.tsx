import { Box } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBButton, FBDialog, FBInput, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBSection } from "..";
import { FBButtonStyles } from "../styles/FBButton.styles";
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
  const classes = FBButtonStyles();
  return (<FBProvider {...{ purchaseOrderState, dialogState }}>
    <FBDialog />
    <FBInput {...{ name, disabled }} type="purchaseorder">
      <Box mb={gutter ? 5 : 0}>
        {mode === "form" && !isPO && <FBSection name={`fb-po-section-${name}`} {...{ label }}  />}
        <FBPurchaseOrderTable {...{ name, disabled, handleItem, handleLot, mode, isReceivable, gutter }} />
        {isReceivable && (
          <FBButton
            variant="outlined"
            color="primary"
            label="form.builder.receive"
            onClick={handleReceiveAll}
            {...{ disabled: loading }}
            className={cx(classes.button)}
          />
        )}
      </Box>
    </FBInput>
  </FBProvider>
  ); };

export default withFBPurchaseOrder(FBPurchaseOrder);
