import { Box } from "@material-ui/core";
import React from "react";
import { FBActionFieldActionsProps, FBButton, FBSubmitButton } from "..";
import { withFBActionFieldActions } from "./FBActionField.actions.wrap";

const FBActionFieldActions: React.FunctionComponent<FBActionFieldActionsProps> = ({
  handleRequest,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="contained"
      label="form.builder.send"
      onClick={handleRequest}
    />
    <FBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBActionFieldActions(FBActionFieldActions);
