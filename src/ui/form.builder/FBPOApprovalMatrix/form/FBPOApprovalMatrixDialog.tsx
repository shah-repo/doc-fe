import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBPOApprovalMatrixDialogProps } from "../FBPOApprovalMatrix.types";
import FBPOApprovalMatrixForm from "./FBPOApprovalMatrixForm";

const FBPOApprovalMatrixDialog: React.FunctionComponent<FBPOApprovalMatrixDialogProps> = ({
  onSubmit,
  name,
  closeDialog,
  isDialogOpen,
  initialValues,
  groupOptions,
  employees,
  signatureStages,
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
        <FBPOApprovalMatrixForm
          name={name}
          onSubmit={onSubmit}
          initialValues={initialValues}
          closeDialog={closeDialog}
          groupOptions={groupOptions}
          employees={employees}
          signatureStages={signatureStages}
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

export default FBPOApprovalMatrixDialog;
