import React from "react";
import { FBStepperEditor } from "../..";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBControlGroupEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor standalone={false} />
    <FBOptionsContainer />
    <FBAdditionsEditor type="controlgroup" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBControlGroupEditor;
