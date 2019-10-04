import { Box } from "@material-ui/core";
import React from "react";
import FBTextField from "../inputs/FBTextField";

const FBSectionEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBTextField label="Label" name="label" />
  </Box>
);

export default FBSectionEditor;
