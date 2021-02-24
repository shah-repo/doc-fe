import React from "react";
import { FBStepperEditor } from "../..";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBSelectEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor standalone={false} />
    <FBOptionsContainer />
    <FBAdditionsEditor type="select" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBSelectEditor;
