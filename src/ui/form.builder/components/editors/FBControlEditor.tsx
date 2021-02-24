import React from "react";
import { FBStepperEditor } from "../..";
import FBAdditionsEditor from "./FBAdditionsEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBControlEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor standalone={false} />
    <FBAdditionsEditor type="control" contextLabel="form.builder.note" />
  </FBStepperEditor>
);

export default FBControlEditor;
