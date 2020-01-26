import { Box } from "@material-ui/core";
import React from "react";
import { FBFieldBottomBarProps } from ".";
import FBButton from "../components/inputs/FBButton";
import { withFBFieldBottomBar } from "./FBFieldBottomBar.wrap";

const FBFieldBottomBar: React.FunctionComponent<FBFieldBottomBarProps> = ({
  visibility,
  onClick,
  mt,
}) => {
  return (
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
        {...{ onClick }}
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
};

export default withFBFieldBottomBar(FBFieldBottomBar);
