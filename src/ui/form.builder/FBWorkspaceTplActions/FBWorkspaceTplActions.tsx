import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton } from "..";
import { FBWorkspaceTplActionsProps } from "./FBWorkspaceTplActions.types";
import { withFBWorkspaceTplActions } from "./FBWorkspaceTplActions.wrap";

const FBWorkspaceTplActions: React.FunctionComponent<FBWorkspaceTplActionsProps> = ({
  handleCancel,
  handleTplName,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={handleTplName}
      autoFocus
    />
    <FBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBWorkspaceTplActions(FBWorkspaceTplActions);
