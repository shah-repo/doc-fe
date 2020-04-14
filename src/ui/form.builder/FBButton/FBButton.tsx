import { Button } from "@material-ui/core";
import React from "react";
import { FBButtonProps } from ".";
import Text from "../../components/Text";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
  color = "secondary",
  variant = "contained",
  ...props
}) => (
  <Button {...{ color, variant }} {...props} type="button">
    <Text message={label} />
  </Button>
);

export default FBButton;
