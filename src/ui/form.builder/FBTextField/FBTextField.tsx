import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { FBInput, FBInputType, FBTextFieldProps } from "..";
import { withFBTextField } from "./FBTextField.wrap";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  onBlur,
  FBProps: { inputType = "textfield", transform } = {},
  placeholder = "",
  multiline,
  error,
  rows,
  type,
  inputProps,
  InputProps,
  style,
  ...props
}) => {
  const [value, setValue] = useState("");
  const onInput = (e) =>     setValue((transform && transform(e.target.value)) || e.target.value);

  return <FBInput {...props} {...{ error }} type={inputType as FBInputType}>
    <TextField
      label=""
      variant="outlined"
      onInput={onInput}
      {...{ type, rows, error, multiline, inputProps, InputProps: { ...(InputProps || {}), value }, style, onBlur, placeholder }}
    />
  </FBInput>;
};

export default withFBTextField(FBTextField);
