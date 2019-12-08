import React from "react";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";
import FBAdditionsEditor from "./FBAdditionsEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBAdditionsEditor type="control" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBControlEditor;
