import React from "react";
import { FBInputProps, FBTextField } from "..";

const FBQuantityField: React.FunctionComponent<FBInputProps> = ({
  ...props
}) => (
  <FBTextField {...props} type="number"/>
);

export default FBQuantityField;
