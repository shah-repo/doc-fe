import React from "react";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";
import { Box } from "@material-ui/core";

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
