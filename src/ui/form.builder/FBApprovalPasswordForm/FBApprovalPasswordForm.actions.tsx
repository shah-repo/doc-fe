import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton } from "..";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";

const FBApprovalPasswordFormActions: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  onDialogApprove,
  onDialogClose,
}) => (
  <Box display="flex" justifyContent="center" mx={3}>
    <FBButton
      variant="outlined"
      onClick={onDialogClose}
      label="common.cancel"
    >
    </FBButton>
    <FBSubmitButton
      variant="contained"
      label="common.confirm"
      onClick={onDialogApprove}
    />
  </Box>
);

export default FBApprovalPasswordFormActions;
