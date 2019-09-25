import { Box, TextField } from "@material-ui/core";
import React from "react";
import { withTextFieldDefaults } from "./utils/hoc";
import { FBTextFieldProps } from "./utils/types";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  labelRenderer,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <TextField
      multiline={Boolean(props.rows && ((props.rows as number) > 0))}
      {...props}
    />
  </Box>
);

export default withTextFieldDefaults(FBTextField);
