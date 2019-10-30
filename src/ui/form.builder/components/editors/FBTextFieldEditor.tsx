import { Box } from "@material-ui/core";
import React from "react";
import FBCheckbox from "../inputs/FBCheckbox";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";

const FBTextFieldEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor />
    <FBPlaceholderEditor />
    <FBTextField
      type="number"
      label="form.builder.rowNumber"
      defaultValue={1}
      name="rows"
    />
    <FBCheckbox label="form.builder.required" name="required" />
  </Box>
);

export default FBTextFieldEditor;
