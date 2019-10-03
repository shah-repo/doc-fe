import { Box } from "@material-ui/core";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { FBFormDefaultProps } from "../../types/common";

const FBEditorSection: React.FunctionComponent<FBFormDefaultProps> = ({
  labelRenderer,
  ...props
}) => {

  return (
    <Box>
      {labelRenderer}
      <Box ml={-1}>
        {props.children}
      </Box>
    </Box>
  );
};

export default withLabelRenderer(FBEditorSection);
