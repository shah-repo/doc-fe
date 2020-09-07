import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBButtonProps } from "../../types/button";

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = "",
  variant = "contained",
  color = "secondary",
  buttonType = "button",
  ...props
}) => (
  <Box component="span" pb={0.5}>
    <Button
      {...{ color, variant }}
      {...props}
      type={buttonType}
      id="FBButton-label"
      data-cy="FBButton-label"
    >
      <Text message={label} />
    </Button>
  </Box>
);

export default FBButton;
