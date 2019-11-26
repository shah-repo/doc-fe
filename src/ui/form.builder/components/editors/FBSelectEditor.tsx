
import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBCheckbox from "../inputs/FBCheckbox";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";

const FBSelectEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer label="form.builder.options" name="options" />
    <FBCheckbox label="form.builder.include.empty" name="includeEmpty" gutter={false} />
    <FBCheckbox label="form.builder.include.other" name="includeOther" />
  </FBStepperEditor>
);

export default FBSelectEditor;
