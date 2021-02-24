import React from "react";
import { FBStepperEditor } from "../..";
import FBTextField from "../inputs/FBTextField";

const FBHelloSignTemplateEditor: React.FunctionComponent<{}> = () => (
  <FBStepperEditor>
    <FBTextField label="form.builder.label" name="label" />
    <FBTextField label="TemplateID" name="templateId" />
  </FBStepperEditor>
);

export default FBHelloSignTemplateEditor;
