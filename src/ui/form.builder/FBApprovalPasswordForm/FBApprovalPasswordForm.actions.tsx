import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton } from "..";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";

const FBApprovalPasswordFormActions: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" justifyContent="center" mx={3}>
    <FBButton
      variant="outlined"
      onClick={handleCancel}
      label="common.cancel"
    >
    </FBButton>
    <FBSubmitButton
      variant="contained"
      label="common.confirm"
      onClick={handleAdd}
    />
  </Box>
);

export default FBApprovalPasswordFormActions;
