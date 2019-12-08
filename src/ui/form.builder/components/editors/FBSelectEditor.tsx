import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBSelectEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer />
    <FBAdditionsEditor type="select" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBSelectEditor;
