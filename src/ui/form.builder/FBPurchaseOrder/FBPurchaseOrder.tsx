import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBInput, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBSection } from "..";
import Colors from "../../layout/theme/utils/colors";
import { StyledFBButton } from "../FBButton/StyledFBButton";
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
          <StyledFBButton
            variant="outlined"
            color="primary"
            label="form.builder.receive"
            onClick={handleReceiveAll}
          />
        )}
        {!disabled && (
          <FBButton
            label="form.builder.add.item"
            onClick={() => handleItem && handleItem()}
            variant="contained"
            style={{
              backgroundColor: Colors.navy,
              borderRadius: "100px",
              fontSize: 12,
              fontWeight: 600,
              color: Colors.white,
              border: `1px solid ${Colors.navy}`,
            }}
            {...{ disabled }}
          />
        )}
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
