import { Box } from "@material-ui/core";
import React from "react";
import FBTextField from "../inputs/FBTextField";
import FBNameEditor from "./FBNameEditor";

const FBLabelEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBTextField label="form.builder.label" name="label" />
    <FBNameEditor />
  </Box>
);

export default FBLabelEditor;
