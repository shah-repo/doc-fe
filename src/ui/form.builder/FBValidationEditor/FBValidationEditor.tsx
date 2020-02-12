import React from "react";
import { FBValidationEditorProps } from ".";
import { FBTabs } from "..";
import { withFBValidationEditor } from "./FBValidationEditor.wrap";

const FBValidationEditor: React.FunctionComponent<FBValidationEditorProps> = ({
  config,
}) => (
  <FBTabs {...{ config }} />
);

export default withFBValidationEditor(FBValidationEditor);
