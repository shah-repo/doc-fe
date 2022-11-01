import { Box } from "@material-ui/core";
import React from "react";
import { FBPOReceiveFormProps, FBSubmitButton } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";
import { withFBPOReceiveForm } from "./FBPOReceiveForm.wrap";

const FBPOReceiveFormActions: React.FunctionComponent<FBPOReceiveFormProps> = ({
  handleCancel,
  handleReceive,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="contained"
      label="form.builder.save"
      onClick={handleReceive}
    />
    <StyledCancelFBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBPOReceiveForm(FBPOReceiveFormActions);
