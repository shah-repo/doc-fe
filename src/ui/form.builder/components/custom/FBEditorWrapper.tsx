import { Box } from "@material-ui/core";
import React from "react";
import { withEditorWrapperDefaults } from "../../hocs/withEditorWrapperDefaults";
import { withMouseOver } from "../../hocs/withMouseOver";
import { FBEditorWrapperProps } from "../../types/editor";
import FBAddFieldButton from "../custom/FBAddFieldButton";
import FBEditorFieldToolbar from "../custom/FBEditorFieldToolbar";

const FBEditorWrapper: React.FunctionComponent<FBEditorWrapperProps> = ({
  visibility,
  ...props
}) => (
  <Box {...props}>
    <FBEditorFieldToolbar visibility={visibility} {...props} />
    {props.children}
    <FBAddFieldButton visibility={visibility} />
  </Box>
);

export default withEditorWrapperDefaults(FBEditorWrapper);
