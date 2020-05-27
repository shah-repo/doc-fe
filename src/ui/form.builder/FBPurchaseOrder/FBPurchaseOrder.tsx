import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBProvider, FBPurchaseOrderProps, FBPurchaseOrderTable, FBSection } from "..";
import { FormContext } from "../../components/forms/FormContext";
import { withFBPurchaseOrder } from "./FBPurchaseOrder.wrap";


const FBPurchaseOrder: React.FunctionComponent<FBPurchaseOrderProps> = ({
  handleItem,
  purchaseOrderState,
  dialogState,
  gutter = true,
  mode = "form",
  label,
  disabled,
  name,
}) => (
  <FBProvider {...{ purchaseOrderState, dialogState }}>
    <FormContext.Provider value={{ submitOnChange: false }}>
      <FBDialog />
      <Box mb={gutter ? 5 : 0}>
        {mode === "form" && <FBSection {...{ label }}  />}
        <FBPurchaseOrderTable {...{ name, disabled, handleItem, mode }} />
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
    </FormContext.Provider>
  </FBProvider>
);

export default withFBPurchaseOrder(FBPurchaseOrder);
