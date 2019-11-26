import React from "react";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBLabelStepperEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
  </FBStepperEditor>
);

export default FBLabelStepperEditor;
