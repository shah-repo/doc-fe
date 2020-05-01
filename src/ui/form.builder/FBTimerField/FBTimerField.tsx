import { Box } from "@material-ui/core";
import React from "react";
import { FBTimerProps } from ".";
import { FBButton, FBTextField } from "..";

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
