import { Box } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputProps, FBTextField } from "..";

const FBPassPercentage: React.FunctionComponent<FBInputProps> = ({
  name,
  ...props
}) => (
  <FBInput
    {...props}
    {...{ name }}
    type="passpercentage"
    name={`${name}`}
    boxProps={{ display: "flex", flexDirection: "column" }}
  >
    <FBTextField
      name={`${name}.value`}
      boxProps={{ mb: 1.5 }}
    />
    <Box display="flex">
      <FBTextField
        name={`${name}.increase`}
        boxProps={{ flexGrow: 1, mr: 2 }}
        type="number"
        placeholder="+ 00"
      />
      <FBTextField
        name={`${name}.decrease`}
        boxProps={{ flexGrow: 1 }}
        type="number"
        placeholder="- 00"
      />
    </Box>
  </FBInput>
);

export default FBPassPercentage;
