import { Box, TextField } from "@material-ui/core";
import React from "react";
import { withTextFieldDefaults } from "../../hocs/withTextFieldDefaults";
import { FBTextFieldProps } from "../../types/textfield";

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
