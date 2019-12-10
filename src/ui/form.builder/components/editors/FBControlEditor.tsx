import React from "react";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBAdditionsEditor type="control" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBControlEditor;
