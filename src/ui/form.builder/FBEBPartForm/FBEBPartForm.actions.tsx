import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton } from "..";

const FBEBPartFormActions: React.FunctionComponent<any> = ({
  onDialogConfirm,
  onDialogClose,
}) => (
  <Box display="flex" justifyContent="center">
    <FBButton
      variant="outlined"
      onClick={onDialogClose}
      label="common.cancel"
    />
    <FBSubmitButton
      variant="contained"
      label="common.confirm"
      onClick={onDialogConfirm}
    />
  </Box>
);

export default FBEBPartFormActions;
