import { TextField, TextFieldProps } from "@material-ui/core";
import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import React from "react";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

export type FBTextFieldProps =
& FBInputProps
& Partial<Omit<RenderInputParams, "InputProps">>
& Pick<TextFieldProps, "InputProps">;

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  rows = 1,
  placeholder,
  error,
  id,
  InputLabelProps,
  InputProps,
  inputProps,
  ...props
}) => (
  <FBInput {...props} type="textfield">
    <TextField
      multiline={Boolean(rows && (rows as number) > 1)}
      variant="outlined"
      label=""
      id="FBTextField-input"
      {...{ rows, placeholder, error, id, InputLabelProps, InputProps, inputProps }}
    />
  </FBInput>
);

export default FBTextField;
