import { Box } from "@material-ui/core";
import React from "react";
import FBCheckbox from "../inputs/FBCheckbox";
import FBLabelEditor from "./FBLabelEditor";

const FBCheckboxEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor />
    <FBCheckbox label="form.builder.include.note" name="includeNote" />
  </Box>
);

export default FBCheckboxEditor;
