import { Box } from "@material-ui/core";
import React from "react";
import { FBStepperEditor } from "../../FBStepperEditor";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";

const FBTextFieldEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBStepperEditor>
      <FBLabelEditor />
      <FBPlaceholderEditor />
      <FBTextField
        type="number"
        label="form.builder.rowNumber"
        defaultValue={1}
        name="rows"
      />
    </FBStepperEditor>
  </Box>
);

export default FBTextFieldEditor;
