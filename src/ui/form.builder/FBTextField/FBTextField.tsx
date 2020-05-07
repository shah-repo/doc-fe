import { TextField } from "@material-ui/core";
import React from "react";
import { FBInput, FBInputType, FBTextFieldProps } from "..";
import Text from "../../components/Text";
import { withFBTextField } from "./FBTextField.wrap";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  onBlur,
  FBProps: { inputType = "textfield" } = {},
  placeholder = "",
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

  <Text message={placeholder}>
    {(placeholder: string) => (
      <FBInput {...props} type={inputType as FBInputType}>
        <TextField
          label=""
          variant="outlined"
          placeholder={placeholder.replace(/^(&nbsp;)+/, "")}
          {...{ type, rows, error, multiline, inputProps, InputProps, style, onBlur }}
        />
      </FBInput>
    )}
  </Text>

);

export default withFBTextField(FBTextField);
