import React from "react";
import FBStepperEditor from "../../FBStepperEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBLabelStepperEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
  </FBStepperEditor>
);

export default FBLabelStepperEditor;
