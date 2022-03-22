import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBEditorActionsProps, FBSubmitButton } from "..";
import { withFBEditorActions } from "./FBEditorActions.wrap";

interface FBLeftEditorActionsProps extends FBEditorActionsProps {
  submitLabel? : string;
  submitStyle? : React.CSSProperties;
  cancelStyle? : React.CSSProperties;
  outerContainerMargin?: number;
}

const FBEditorActions: React.FunctionComponent<FBLeftEditorActionsProps> = ({
  handleAdd,
  handleCancel,
  submitStyle,
  cancelStyle,
  outerContainerMargin = 3,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={outerContainerMargin}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={handleAdd}
      dataCy={"fb-editor-actions-add"}
      autoFocus
      style = {submitStyle}
    />
    <FBButton
      variant="outlined"
      label="common.cancel"
      dataCy={"fb-editor-actions-cancel"}
      onClick={handleCancel}
      style={cancelStyle}
    />
  </Box>
);

export default withFBEditorActions(FBEditorActions);
