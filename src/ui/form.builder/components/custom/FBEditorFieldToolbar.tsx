import { Box } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import { FBEditorWrapperProps } from "../../types/editor";

const FBEditorFieldToolbar: React.FunctionComponent<FBEditorWrapperProps> = ({
  removeSchemaItem,
  editSchemaItem,
  toolbarMargin,
  ...props
}) => (
  <Box
    display="flex"
    flexDirection="row-reverse"
    mb={toolbarMargin}
    {...props}
  >
    <Box zIndex="tooltip">
      <RemoveCircleOutlineIcon
        onClick={removeSchemaItem}
        color="error"
      />
    </Box>
    <Box pr={2} zIndex="tooltip">
      <BorderColorIcon
        onClick={editSchemaItem}
        color="primary"
      />
    </Box>
  </Box>
);

export default FBEditorFieldToolbar;
