import { Box } from "@material-ui/core";
import React from "react";
import { withEditorWrapperDefaults } from "../../hocs/withEditorWrapperDefaults";
import { formBuilderStore } from "../../stores/FBStore";
import { FBEditorWrapperProps } from "../../types/editor";
import FBAddFieldButton from "../custom/FBAddFieldButton";
import FBEditorFieldToolbar from "../custom/FBEditorFieldToolbar";

const FBEditorWrapper: React.FunctionComponent<FBEditorWrapperProps> = ({
  visibility,
  ...props
}) => (
  <Box {...props}>
    <FBEditorFieldToolbar
      visibility={visibility}
      mb={formBuilderStore.toolbarMargin(props.index)}
      {...props}
    />
    {props.children}
    <FBAddFieldButton visibility={visibility} />
  </Box>
);

export default withEditorWrapperDefaults(FBEditorWrapper);
