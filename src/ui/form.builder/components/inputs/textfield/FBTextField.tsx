import { Box, TextField } from "@material-ui/core";
import React from "react";
import { withTextFieldDefaults } from "./utils/hoc";
import { FBTextFieldProps } from "./utils/types";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  labelRenderer,
  ...props
}) => {

  return (
    <Box mb={4}>
      {labelRenderer}
      <TextField
        {...props}
        label=""
      />
    </Box>
  );
};

export default withTextFieldDefaults(FBTextField);
