import { Box } from "@material-ui/core";
import React from "react";
import FBTextField from "../inputs/FBTextField";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBHyperlinkEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor standalone={false} />
    <FBTextField
      type="url"
      label="URL"
      name="linkUrl"
    />
    <FBAdditionsEditor type="label" />
  </Box>
);

export default FBHyperlinkEditor;
