import { TextField } from "@material-ui/core";
import React from "react";
import { FBTextFieldProps } from "../../types/inputs/textfield";
import FBInput from "../common/FBInput";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  rows,
  ...props
}) => (
  <FBInput {...props} type="textfield">
    <TextField
      multiline={Boolean(rows && (rows as number) > 0)}
      variant="outlined"
      label=""
    />
  </FBInput>
);

export default FBTextField;
