import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";
import FBAdditionsEditor from "./FBAdditionsEditor";

const FBControlGroupEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer label="form.builder.options" name="options" />
    <FBAdditionsEditor type="controlgroup" />
  </FBStepperEditor>
);

export default FBControlGroupEditor;
