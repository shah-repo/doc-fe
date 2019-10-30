import { Box } from "@material-ui/core";
import React from "react";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";

const FBHyperlinkEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor />
    <FBTextField
      type="url"
      label="URL"
      name="linkUrl"
    />
  </Box>
);

export default FBHyperlinkEditor;
