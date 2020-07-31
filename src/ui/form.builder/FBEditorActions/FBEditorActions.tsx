import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorActionsProps } from ".";
import { FBButton, FBSubmitButton } from "..";
import { withFBEditorActions } from "./FBEditorActions.wrap";

const FBEditorActions: React.FunctionComponent<FBEditorActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={handleAdd}
      dataCy={"fb-editor-actions-add"}
      autoFocus
    />
    <FBButton
      variant="outlined"
      label="common.cancel"
      dataCy={"fb-editor-actions-cancel"}
      onClick={handleCancel}
    />
  </Box>
);

export default withFBEditorActions(FBEditorActions);
