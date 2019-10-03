import { Box } from "@material-ui/core";
import React from "react";
import FBCheckbox from "../inputs/FBCheckbox";
import FBTextField from "../inputs/FBTextField";

const FBCheckboxEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBTextField label="Label" name="label" />
    <FBTextField label="Notes" name="notes" />
    <FBCheckbox controlLabel="Required" name="required" />
  </Box>
);

export default FBCheckboxEditor;
