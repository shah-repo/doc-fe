import { Box } from "@material-ui/core";
import React from "react";
import { FBActionFieldActionsProps, FBSubmitButton } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";
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
    <StyledCancelFBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBActionFieldActions(FBActionFieldActions);
