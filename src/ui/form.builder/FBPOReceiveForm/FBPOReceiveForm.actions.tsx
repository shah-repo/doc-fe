import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBPOReceiveFormProps, FBSubmitButton } from "..";
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
    <FBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBPOReceiveForm(FBPOReceiveFormActions);
