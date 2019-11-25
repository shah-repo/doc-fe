import React from "react";
import FBCheckbox from "../inputs/FBCheckbox";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBCheckbox label="form.builder.include.note" name="includeNote" />
  </FBStepperEditor>
);

export default FBControlEditor;
