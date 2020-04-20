import React from "react";
import FBTextField from "../inputs/FBTextField";

export interface FBLabelEditorProps {
  defaultValue?: string;
}
const FBLabelEditor: React.FunctionComponent<FBLabelEditorProps> = ({
  ...props
}) => (
  <FBTextField label="form.builder.label" {...props} name="label"  />
);

export default FBLabelEditor;
