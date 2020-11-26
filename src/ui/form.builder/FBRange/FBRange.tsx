import { Box } from "@material-ui/core";
import React from "react";
import { FBRangeProps } from ".";
import { FBTextField } from "..";
import { withFBRange } from "./FBRange.wrap";

const FBRange: React.FunctionComponent<FBRangeProps> = ({
  ...props
}) => (
  <Box display="inline-flex">
    <Box marginRight={1}>
      <FBTextField type="number" placeholder="form.builder.from" name="from"/>
    </Box>
    <Box>
      <FBTextField type="number" placeholder="form.builder.to" name="to"/>
    </Box>
  </Box>
);

export default withFBRange(FBRange);
