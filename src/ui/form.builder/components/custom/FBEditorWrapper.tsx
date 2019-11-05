import { Box } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import _ from "lodash";
import React from "react";
import { withEditorWrapper } from "../../hocs/withEditorWrapper";
import { FBEditorWrapperProps } from "../../types/editor";
import FBAddFieldButton from "../custom/FBAddFieldButton";
import FBEditorFieldToolbar from "../custom/FBEditorFieldToolbar";

const FBEditorWrapper: React.FunctionComponent<FBEditorWrapperProps> = ({
  visibility,
  indicatorVisibility,
  indicatorMargin,
  onMouseDown,
  ...props
}) => (
  <Box {..._.omit(props, ["removeSchemaItem", "editSchemaItem"])}>
    <FBEditorFieldToolbar visibility={visibility} {...props}/>
    <Box display="flex" flexDirection="row">
      <Box width="100%">{props.children}</Box>
      <Box
        mb={indicatorMargin}
        display="flex"
        width="0"
        alignItems="center"
        visibility={indicatorVisibility}
        style={{cursor: "grab"}}
      >
        <DragIndicatorIcon  />
      </Box>
    </Box>
    <FBAddFieldButton visibility={visibility} index={props.index} />
  </Box >
);

export default withEditorWrapper(FBEditorWrapper);
