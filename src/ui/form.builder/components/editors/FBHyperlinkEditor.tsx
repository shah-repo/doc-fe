import React from "react";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBHyperlinkEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBTextField
      type="url"
      label="URL"
      name="linkUrl"
    />
  </FBStepperEditor>
);

export default FBHyperlinkEditor;
