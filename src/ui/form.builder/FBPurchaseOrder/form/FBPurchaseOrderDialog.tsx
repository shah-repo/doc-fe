import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import FBButton from "../../components/inputs/FBButton";
import { withFBPurchaseOrderDialog } from "./FBPurchaseOrderDialog.wrap";
import FBPurchaseOrderForm from "./FBPurchaseOrderForm";

const FBPurchaseOrderDialog: React.FunctionComponent<any> = ({
  poState,
  onSubmit,
  disabled,
  name,
  closeDialog,
  addItem,
  isDialogOpen,
}) => {
  const renderDialog = isDialogOpen && (
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      fullWidth={true}
      id="FBPurchaseOrderDialog-openButton"
    >
      <DialogTitle >
        <Typography align="center" variant="h4">
          <Text translation="form.builder.add.item" />
        </Typography>
      </DialogTitle>
      <DialogContent id="FBPurchaseOrderDialog-closeDialog">
        <FBPurchaseOrderForm name={name} />
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <FBButton
        fullWidth={true}
        disabled={disabled}
        label="form.builder.add.item"
        onClick={addItem}
        variant="outlined"
        style={{ margin: "8px 0" }}
      />
      {renderDialog}
    </>
  );
};

export default withFBPurchaseOrderDialog(FBPurchaseOrderDialog);
