import { TextField } from "@material-ui/core";
import React from "react";
import { FBQuantityProps } from ".";
import FBInput from "../components/common/FBInput";

const FBQuantityField: React.FunctionComponent<FBQuantityProps> = ({
  placeholder,
  error,
  id,
  ...props
}) => (
  <FBInput {...props} type="quantity">
    <TextField
      type="number"
      variant="outlined"
      label=""
      inputProps={{ min: "0" }}
      {...{ placeholder, error, id }}
    />
  </FBInput>
);

export default FBQuantityField;
