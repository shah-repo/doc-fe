import { TextField } from "@material-ui/core";
import React from "react";
import FBInput from "../common/FBInput";
import { FBInputProps } from "../../types/common";

const FBTextField: React.FunctionComponent<FBInputProps> = ({
  rows = 1,
  placeholder,
  ...props
}) => (
  <FBInput {...props} type="textfield">
    <TextField
      multiline={Boolean(rows && (rows as number) > 1)}
      variant="outlined"
      label=""
      {...{rows, placeholder}}
    />
  </FBInput>
);

export default FBTextField;
