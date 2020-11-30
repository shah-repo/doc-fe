import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton } from "..";

const FBEBPartFormActions: React.FunctionComponent<any> = ({
  onDialogConfirm,
  onDialogClose,
  disabled,
}) => (
  <Box display="flex" justifyContent="center">
    <FBButton
      variant="outlined"
      onClick={onDialogClose}
      label="common.cancel"
      {...{ disabled }}
    />
    <FBSubmitButton
      variant="contained"
      label="common.confirm"
      onClick={onDialogConfirm}
      {...{ disabled }}
    />
  </Box>
);

export default FBEBPartFormActions;
