import { Box } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import React from "react";
import { withMouseOver } from "../../hocs/withMouseOver";
import sortableStore from "../../stores/FBSortableStore";
import formBuilderStore from "../../stores/FBStore";
import { FBEditorWrapperProps } from "../../types/editor";
import FBAddFieldButton from "../custom/FBAddFieldButton";
import FBEditorFieldToolbar from "../custom/FBEditorFieldToolbar";

const FBEditorWrapper: React.FunctionComponent<FBEditorWrapperProps> = ({
  visibility,
  indicatorVisibility,
  toolbarMargin,
  indicatorMargin,
  ...props
}) => {

  return (
  <Box {...props}>
    <FBEditorFieldToolbar
      visibility={visibility}
      mb={toolbarMargin}
      {...props}
    />
    <Box display="flex" flexDirection="row">
      <Box width="100%">{props.children}</Box>
      <Box
        mb={indicatorMargin}
        display="flex"
        width="0"
        alignItems="center"
        visibility={indicatorVisibility}
        style={{cursor: "grab"}}
        // onMouseDown={props.onMouseDown}
      >
        <DragIndicatorIcon  />
      </Box>
    </Box>
    <FBAddFieldButton visibility={visibility} />
  </Box >
);

};

export default withMouseOver(FBEditorWrapper);
