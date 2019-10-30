import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button/Button";
import React from "react";
import Text from "../../../components/Text";
import { FBFormDefaultProps } from "../../types/common";

type Props = ButtonProps & FBFormDefaultProps;

const FBButton: React.FunctionComponent<Props> = ({
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
