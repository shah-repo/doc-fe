import React from "react";
import FBStepperEditor from "../../FBStepperEditor";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBAdditionsEditor type="control" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBControlEditor;
