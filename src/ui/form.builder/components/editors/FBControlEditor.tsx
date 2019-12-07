import React from "react";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";
import FBAdditionsEditor from "./FBAdditionsEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBAdditionsEditor type="control" />
  </FBStepperEditor>
);

export default FBControlEditor;
