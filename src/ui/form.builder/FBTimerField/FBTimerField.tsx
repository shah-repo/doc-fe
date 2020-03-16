import { Box } from "@material-ui/core";
import React from "react";
import { FBTimerProps } from ".";
import FBButton from "../components/inputs/FBButton";
import FBTextField from "../components/inputs/FBTextField";

const FBTimerField: React.FunctionComponent<FBTimerProps> = ({
  ...props
}) => (
  <Box display="flex" alignItems="center">
    <Box flexGrow={1}>
      <FBTextField {...props} />
    </Box>
    <FBButton label="form.builder.start.timer" />
  </Box>
);

export default FBTimerField;
