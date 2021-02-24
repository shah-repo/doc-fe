import { Box } from "@material-ui/core";
import React from "react";
import { FBStepperEditor } from "../..";
import FBTextField from "../inputs/FBTextField";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";

const FBTextFieldEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBStepperEditor>
      <FBLabelEditor standalone={false} />
      <FBPlaceholderEditor />
      <FBTextField
        type="number"
        label="form.builder.rowNumber"
        defaultValue={1}
        name="rows"
      />
      <FBAdditionsEditor type="textfield" />
    </FBStepperEditor>
  </Box>
);

export default FBTextFieldEditor;
