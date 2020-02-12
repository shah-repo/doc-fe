import React from "react";
import { FBStepperEditorProps } from ".";
import { FBStepper } from "..";
import { withFBStepperEditor } from "./FBStepperEditor.wrap";

const FBStepperEditor: React.FunctionComponent<FBStepperEditorProps> = ({
  config,
  beforeStepChange,
}) => (
  <FBStepper {...{ config, beforeStepChange }} />
);

export default withFBStepperEditor(FBStepperEditor);
