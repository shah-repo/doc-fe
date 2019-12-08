import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";
import FBAdditionsEditor from "./FBAdditionsEditor";

const FBControlGroupEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer />
    <FBAdditionsEditor type="controlgroup" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBControlGroupEditor;
