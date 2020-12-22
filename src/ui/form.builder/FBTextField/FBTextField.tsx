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
  <FBInput {...props} {...{ error, defaultValue }} type={inputType as FBInputType}>
    {mode === "preview" && (
      <Box>{defaultValue}</Box>
    )}
    {mode !== "preview" && (
      <TextField
        data-cy={dataCy ? dataCy : props.name}
        label=""
        variant="outlined"
        inputProps={{
          ...inputProps,
          ...(type === "number") && {
            onWheel: (e) => { e.currentTarget.blur(); },
          },
        }}
        {...{ type, rows, error, multiline, InputProps, style, onBlur, placeholder }}
      />
    )}
  </FBInput>
);

export default withFBTextField(FBTextField);
