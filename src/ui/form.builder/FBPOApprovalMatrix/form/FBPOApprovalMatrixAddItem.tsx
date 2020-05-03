import React from "react";
import FBButton from "../../components/inputs/FBButton";
import { FBPOApprovalMatrixAddItemProps } from "../FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrixAddItem } from "./FBPOApprovalMatrixAddtem.wrap";
import FBPOApprovalMatrixDialog from "./FBPOApprovalMatrixDialog";

const FBPOApprovalMatrixAddItem: React.FunctionComponent<FBPOApprovalMatrixAddItemProps> = ({
  disabled,
  openDialog,
  isDialogOpen,
  closeDialog,
  onSubmit,
  name,
  employees,
  groupOptions,
  signatureStages,
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
    <FBPOApprovalMatrixDialog
      isDialogOpen={isDialogOpen}
      closeDialog={closeDialog}
      onSubmit={onSubmit}
      name={name}
      employees={employees}
      groupOptions={groupOptions}
      signatureStages={signatureStages}
    />
  </>
);

export default withFBPOApprovalMatrixAddItem(FBPOApprovalMatrixAddItem);
