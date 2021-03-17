import { Box, InputBase } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputType } from "..";
import { FBInputBaseFieldProps } from "./FBInputBaseField.types";
import { withFBInputBaseField } from "./FBInputBaseField.wrap";

const FBInputBaseField: React.FunctionComponent<FBInputBaseFieldProps> = ({
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
  className,
  gutter = false,
  ...props
}) => (
  <FBInput {...props} {...{ error, defaultValue, gutter }} type={inputType as FBInputType}>
    {mode === "preview" && (
      <Box>{defaultValue}</Box>
    )}
    { mode !== "preview" &&
      <InputBase
        {...{ placeholder, style }}
        inputProps={{ "aria-label": "naked" }}
      />}
  </FBInput>
);

export default withFBInputBaseField(FBInputBaseField);
