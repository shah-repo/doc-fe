import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import FBPurchaseOrderLotFormContainer from "./FBPurchaseOrderLotForm.container";
const FBPurchaseOrderLotDialog: React.FunctionComponent<any> = ({
  onSubmit,
  name,
  closeDialog,
  isDialogOpen,
  initialValues,
}) => {
  const renderDialog = isDialogOpen && (
    <Dialog
      open={isDialogOpen}
      fullWidth={true}
      id="FBPurchaseOrderDialog-openButton"
    >
      <DialogTitle >
        <Typography align="center" variant="h4">
          <Text translation="form.builder.lot" />
        </Typography>
      </DialogTitle>
      <DialogContent id="FBPurchaseOrderDialog-closeDialog">
        <FBPurchaseOrderLotFormContainer
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

export default FBPurchaseOrderLotDialog;
