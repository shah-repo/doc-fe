import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBPurchaseOrderDialogProps } from "../FBPurchaseOrder.types";
import FBPurchaseOrderForm from "./FBPurchaseOrderForm";
const FBPurchaseOrderDialog: React.FunctionComponent<FBPurchaseOrderDialogProps> = ({
  onSubmit,
  name,
  closeDialog,
  isDialogOpen,
  initialValues,
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
        <FBPurchaseOrderForm
          name={name}
          onSubmit={onSubmit}
          initialValues={initialValues}
          closeDialog={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {renderDialog}
    </>
  );
};

export default FBPurchaseOrderDialog;
