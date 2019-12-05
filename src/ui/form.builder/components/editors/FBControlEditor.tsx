import React from "react";
import FBCheckbox from "../inputs/FBCheckbox";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBCheckbox
      type="checkbox"
      label="form.builder.include.note"
      name="includeContext"
    />
  </FBStepperEditor>
);

export default FBControlEditor;
