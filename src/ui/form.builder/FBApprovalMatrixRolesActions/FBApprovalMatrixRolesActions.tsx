import { Box } from "@material-ui/core";
import React from "react";
import { FBApprovalMatrixRolesActionsProps, FBButton, FBSubmitButton } from "..";
import { withFBApprovalMatrixRolesActions } from "./FBApprovalMatrixRolesActions.wrap";

// *TODO: find a way to handle action state from dialog
const FBApprovalMatrixRolesActions: React.FunctionComponent<FBApprovalMatrixRolesActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
    <Box display="flex" flexDirection="row-reverse" mx={2}>
      <FBSubmitButton
        variant="outlined"
        label="common.add"
        dataCy="common.add"
        onClick={handleAdd}
        autoFocus
      />
      <FBButton
        variant="outlined"
        label="common.cancel"
        dataCy="common.cancel"
        onClick={handleCancel}
      />
    </Box>
  );

export default withFBApprovalMatrixRolesActions(FBApprovalMatrixRolesActions);
