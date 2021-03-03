import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBFieldBottomBarProps } from "..";
import { withFBStarter } from "../FBStarter/FBStarter.wrap";

const FBFieldBottomBar: React.FunctionComponent<FBFieldBottomBarProps> = ({
  visibility,
  onClick,
  index = 0,
  mt,
}) => (
  <Box display="flex" {...{ visibility, mt }}>
    <Box
      borderTop={3}
      my="auto"
      height="1px"
      width="100%"
      color="primary.main"
    />
    <FBButton
      label="form.builder.add.field"
      color="primary"
      fullWidth={true}
      size="medium"
      variant="text"
      onClick={() => onClick && onClick(index + 1)}
    />
    <Box
      borderTop={3}
      my="auto"
      height="1px"
      width="100%"
      color="primary.main"
    />
  </Box>
);

export default withFBStarter(FBFieldBottomBar);
