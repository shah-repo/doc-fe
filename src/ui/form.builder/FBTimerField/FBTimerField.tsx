import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBTextField, FBTimerProps } from "..";

const FBTimerField: React.FunctionComponent<FBTimerProps> = ({
  ...props
}) => (
  <Box display="flex" >
    <Box flexGrow={1}>
      <FBTextField {...props} />
    </Box>
    <Box mt={3.4}>
      <FBButton disabled={props.disabled} variant="outlined" label="form.builder.start.timer" />
    </Box>
  </Box>
);

export default FBTimerField;
