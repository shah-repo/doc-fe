import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBButtonProps } from "../../types/button";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label,
  variant = "contained",
  color = "secondary",
  ...props
}) => (
  <Button variant={variant} color={color} {...props}>
    <Text message={label} />
  </Button>
);

export default FBButton;
