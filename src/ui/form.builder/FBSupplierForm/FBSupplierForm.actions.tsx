import { Box } from "@material-ui/core";
import React from "react";
import { FBSubmitButton } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";

const FBSupplierFormActions: React.FunctionComponent<any> = ({
  onDialogConfirm,
  onDialogClose,
  disabled,
}) => (
  <Box display="flex" justifyContent="center">
    <StyledCancelFBButton
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

export default FBSupplierFormActions;
