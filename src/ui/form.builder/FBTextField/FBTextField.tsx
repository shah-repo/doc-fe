import { Box, TextField } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputType, FBTextFieldProps } from "..";
import { withFBTextField } from "./FBTextField.wrap";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  onBlur,
  FBProps: { inputType = "textfield" } = {},
  placeholder = "",
  multiline,
  defaultValue,
  error,
  rows,
  type,
  inputProps,
  InputProps,
  style,
  dataCy,
  mode,
  ...props
}) => (
  <FBInput {...props} {...{ error }} type={inputType as FBInputType}>
    {mode === "preview" && (
      <Box>{defaultValue}</Box>
    )}
    {mode !== "preview" && (
      <TextField
        data-cy={dataCy ? dataCy : props.name}
        label=""
        variant="outlined"
        {...{ type, rows, error, multiline, inputProps, InputProps, style, onBlur, placeholder }}
      />
    )}
  </FBInput>
);

export default withFBTextField(FBTextField);
