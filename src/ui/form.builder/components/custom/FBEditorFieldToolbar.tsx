import { Box } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import editorStore from "../../stores/FBEditorStore";
import formBuilderStore from "../../stores/FBStore";
import { FBEditorWrapperProps } from "../../types/editor";

const FBEditorFieldToolbar: React.FunctionComponent<FBEditorWrapperProps> = ({
  index,
  ...props
}) => (
  <Box
    display="flex"
    flexDirection="row-reverse"
    {...props}
  >
    <Box>
      <RemoveCircleOutlineIcon
        onClick={formBuilderStore.removeSchema(index)}
        color="error"
      />
    </Box>
    <Box pr={2}>
      <BorderColorIcon
        onClick={editorStore.editorTypeEdit(index)}
        color="primary"
      />
    </Box>
  </Box>
);

export default FBEditorFieldToolbar;
