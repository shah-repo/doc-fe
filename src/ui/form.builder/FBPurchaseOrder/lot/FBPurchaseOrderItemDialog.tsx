import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { Dictionary } from "lodash";
import React, { useState } from "react";
import Text from "../../../components/Text";
import { FBPurchaseOrderDialogProps, PurchaseOrderItem } from "../FBPurchaseOrder.types";
import FBPurchaseOrderCreateLot from "./FBPurchaseOrderCreateLot";
import FBPurchaseOrderReceiveFormContainer from "./FBPurchaseOrderReceiveForm.container";
const FBPurchaseOrderItemDialog: React.FunctionComponent<FBPurchaseOrderDialogProps> = ({
  onSubmit,
  name,
  closeDialog,
  isDialogOpen,
  initialValues = {} as Dictionary<PurchaseOrderItem>,
}) => {
  const [showForm, setShowForm] = useState(false);
  const renderControls = !showForm &&
    <Box textAlign="center">
      <FBPurchaseOrderCreateLot
        item={initialValues[`${name}-formValues`]}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowForm(true)}
      >
        <Text translation="form.builder.po.items.received" />
      </Button>
    </Box>;
  const renderForm = showForm &&
    <FBPurchaseOrderReceiveFormContainer
      name={name}
      onSubmit={onSubmit}
      initialValues={initialValues}
      closeDialog={closeDialog}
    />;
  const renderDialog = isDialogOpen && (
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      fullWidth={true}
      id="FBPurchaseOrderDialog-openButton"
    >
      <DialogTitle >
        <Typography align="center" variant="h4">
          <Text translation="form.builder.po.line.item" />
        </Typography>
      </DialogTitle>
      <DialogContent id="FBPurchaseOrderDialog-closeDialog">
        {renderControls}
        {renderForm}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {renderDialog}
    </>
  );
};

export default FBPurchaseOrderItemDialog;
