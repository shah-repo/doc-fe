import { Box, TextField } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputType, FBTextFieldProps } from "..";
import { withFBTextField } from "./FBTextField.wrap";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  onBlur,
  onFocus,
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
  className,
  locked,
  value,
  ...props
}) => (
  <FBInput {...props} {...{ error, defaultValue, locked }} type={inputType as FBInputType}>
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
        {...{
          onBlur,
          onFocus,
          type,
          rows,
          error,
          multiline,
          InputProps,
          style,
          placeholder,
          className,
          value,
        }}
      />
    )}
  </FBInput>
);

export default withFBTextField(FBTextField);
