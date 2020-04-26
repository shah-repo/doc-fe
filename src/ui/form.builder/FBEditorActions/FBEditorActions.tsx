import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FBButton, FBSubmitButton } from "..";
import { withFBEditorActions } from "./FBEditorActions.wrap";

const FBEditorActions: React.FunctionComponent<FBEditorActionsProps> = ({
  onAddClick,
  onCancelClick,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={onAddClick}
      autoFocus
    />
    <FBButton
      variant="outlined"
      label="common.cancel"
      onClick={onCancelClick}
    />
  </Box>
);

export default withFBEditorActions(FBEditorActions);
