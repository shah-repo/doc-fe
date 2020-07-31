import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBStarterProps } from "..";
import { withFBStarter } from "./FBStarter.wrap";

const FBStarter: React.FunctionComponent<FBStarterProps> = ({
  onClick,
}) => (
  <Box
    display="flex"
    my={1}
    border={1}
    style={{ borderStyle: "dashed" }}
  >
    <FBButton
      label="form.builder.add.field"
      dataCy="form.builder.add.field"
      color="primary"
      size="medium"
      variant="text"
      fullWidth={true}
      onClick={() => onClick && onClick(0)}
    />
  </Box>
);

export default withFBStarter(FBStarter);
