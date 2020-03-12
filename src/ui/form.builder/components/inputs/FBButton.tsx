import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBButtonProps } from "../../types/button";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
  variant = "contained",
  color = "secondary",
  type = "button",
  ...props
}) => (
  <Box component="span" pb={0.5}>
    <Button {...{ color, variant, type }} {...props} id="FBButton-label">
      <Text message={label} />
    </Button>
  </Box>
);

export default FBButton;
