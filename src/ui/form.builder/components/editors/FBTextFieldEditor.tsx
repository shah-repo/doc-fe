import React from "react";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBTextFieldEditor: React.FunctionComponent<{}> = () => (
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
);

export default FBTextFieldEditor;
