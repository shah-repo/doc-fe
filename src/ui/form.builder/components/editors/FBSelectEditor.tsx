import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBSelectEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer label="form.builder.options" name="options" />
    <FBAdditionsEditor type="select" />
  </FBStepperEditor>
);

export default FBSelectEditor;
