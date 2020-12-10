import { Box } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputProps, FBTextField } from "..";
import { withFBRange } from "./FBRange.wrap";

const FBRange: React.FunctionComponent<FBInputProps> = ({
  name,
  ...props
}) => (
  <FBInput
    {...props}
    {...{ name }}
    type="range"
  >
    <Box display="flex">
      <FBTextField
        boxProps={{ mr: 2, flexGrow: 1 }}
        type="number"
        placeholder="form.builder.from"
        name={`${name}.from`}
        gutter={false}
      />
      <FBTextField
        type="number"
        placeholder="form.builder.to"
        name={`${name}.to`}
        boxProps={{ flexGrow: 1 }}
        gutter={false}
      />
    </Box>
  </ FBInput>
);

export default withFBRange(FBRange);
