import React from "react";
import FBButton from "../../components/inputs/FBButton";
import { withFBPurchaseOrderAddItem } from "./FBPurchaseOrderAddtem.wrap";
import FBPurchaseOrderDialog from "./FBPurchaseOrderDialog";

const FBPurchaseOrderAddItem: React.FunctionComponent<any> = ({
  disabled,
  openDialog,
  isDialogOpen,
  closeDialog,
  onSubmit,
  name,
}) => (
  <>
    <FBButton
      fullWidth={true}
      disabled={disabled}
      label="form.builder.add.item"
      onClick={openDialog}
      variant="outlined"
      style={{ margin: "8px 0" }}
    />
    <FBPurchaseOrderDialog
      isDialogOpen={isDialogOpen}
      closeDialog={closeDialog}
      onSubmit={onSubmit}
      name={name}
    />
  </>
);

export default withFBPurchaseOrderAddItem(FBPurchaseOrderAddItem);
