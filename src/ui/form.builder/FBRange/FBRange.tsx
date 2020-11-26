import { Box } from "@material-ui/core";
import React from "react";
import { FBRangeProps } from ".";
import FBTextField from "../components/inputs/FBTextField";
import { withFBRange } from "./FBRange.wrap";

const FBRange: React.FunctionComponent<FBRangeProps> = ({
  ...props
}) => (
  <Box display="flex">
    <Box marginRight={4}>
      <FBTextField type="number" label="form.builder.from" name="from"/>
    </Box>
    <Box>
      <FBTextField type="number" label="form.builder.to" name="to"/>
    </Box>
  </Box>
);

export default withFBRange(FBRange);
