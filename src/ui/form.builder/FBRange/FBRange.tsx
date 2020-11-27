import { Box } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputProps, FBTextField } from "..";
import { withFBRange } from "./FBRange.wrap";

const FBRange: React.FunctionComponent<FBInputProps> = ({
  name,
  ...props
}) => (
  <FBInput {...props} {...{ name }} type="range">
    <Box display="inline-flex">
      <FBTextField
        boxProps={{ mr: 1 }}
        type="number"
        placeholder="form.builder.from"
        name={`${name}.from`}
        gutter={false}
        withState
      />
      <FBTextField
        type="number"
        placeholder="form.builder.to"
        name={`${name}.to`}
        gutter={false}
        withState
      />
    </Box>
  </ FBInput>
);

export default withFBRange(FBRange);
