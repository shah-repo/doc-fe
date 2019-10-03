import { Box } from "@material-ui/core";
import React from "react";
import FBCheckbox from "../inputs/FBCheckbox";
import FBTextField from "../inputs/FBTextField";

const FBTextFieldEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBTextField label="Label" name="label" />
    <FBTextField label="Placeholder" name="placeholder" />
    <FBTextField
      type="number"
      label="Row number"
      defaultValue={1}
      name="rows"
    />
    <FBCheckbox controlLabel="Required" name="required" />
  </Box>
);

export default FBTextFieldEditor;
