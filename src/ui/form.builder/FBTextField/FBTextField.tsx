import { TextField } from "@material-ui/core";
import React from "react";
import { FBInput, FBTextFieldProps } from "..";
import { withFBTextField } from "./FBTextField.wrap";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  placeholder,
  multiline,
  error,
  rows,
  type,
  inputProps,
  InputProps,
  variant,
  style,
  ...props
}) => (
  <FBInput {...props} type="textfield">
    <TextField
      label=""
      variant="outlined"
      {...{ type, rows, placeholder, error, multiline, inputProps, InputProps, style }}
    />
  </FBInput>
);

export default withFBTextField(FBTextField);
