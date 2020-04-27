import { TextField } from "@material-ui/core";
import React from "react";
import { FBInput } from "..";
import { FBTextFieldProps } from "./FBTextField.types";
import { withFBTextField } from "./FBTextField.wrap";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  placeholder,
  multiline,
  error,
  rows,
  type,
  ...props
}) => (
  <FBInput {...props} type="textfield">
    <TextField
      variant="outlined"
      label=""
      {...{ type, rows, placeholder, error, multiline }}
    />
  </FBInput>
);

export default withFBTextField(FBTextField);
