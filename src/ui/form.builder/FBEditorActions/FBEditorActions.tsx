import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBEditorActionsProps, FBSubmitButton } from "..";
import styles from "./FBEditorActions.styles";
import { withFBEditorActions } from "./FBEditorActions.wrap";

interface FBLeftEditorActionsProps extends FBEditorActionsProps {
  outerContainerMargin?: number;
}

const FBEditorActions: React.FunctionComponent<FBLeftEditorActionsProps> = ({
  handleAdd,
  handleCancel,
}) => {
  const style = styles;
  return (
    <Box display="flex" flexDirection="row-reverse" mx={0}>
      <FBSubmitButton
        variant="outlined"
        label="common.add"
        onClick={handleAdd}
        dataCy={"fb-editor-actions-add"}
        autoFocus
        style={style.submitStyle}
      />
      <FBButton
        variant="outlined"
        label="common.cancel"
        dataCy={"fb-editor-actions-cancel"}
        onClick={handleCancel}
        style={style.cancelStyle}
      />
    </Box>
  );
};

export default withFBEditorActions(FBEditorActions);
