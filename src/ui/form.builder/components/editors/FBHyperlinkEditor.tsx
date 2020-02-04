import React from "react";
import FBStepperEditor from "../../FBStepperEditor";
import FBTextField from "../inputs/FBTextField";
import FBLabelEditor from "./FBLabelEditor";

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
