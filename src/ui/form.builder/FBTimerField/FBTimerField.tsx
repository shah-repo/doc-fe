import { Box } from "@material-ui/core";
import React from "react";
import { FBTimerProps } from ".";
import { FBButton } from "..";
import FBTextField from "../components/inputs/FBTextField";

const FBTimerField: React.FunctionComponent<FBTimerProps> = ({
  ...props
}) => (
  <Box display="flex" >
    <Box flexGrow={1}>
      <FBTextField {...props} />
    </Box>
    <Box mt={3.4}>
      <FBButton variant="outlined" label="form.builder.start.timer" />
    </Box>
  </Box>
);

export default FBTimerField;
