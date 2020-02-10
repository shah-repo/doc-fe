import React from "react";
import FBStepperEditor from "../../FBStepperEditor";
import FBLabelEditor from "./FBLabelEditor";

const FBPurchaseOrderEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
  </FBStepperEditor>
);

export default FBPurchaseOrderEditor;
