import React from "react";
import FBTextField from "../inputs/FBTextField";

export interface FBLabelEditorProps {
  defaultValue?: string;
}
const FBLabelEditor: React.FunctionComponent<FBLabelEditorProps> = ({
  ...props
}) => (
  <FBTextField label="form.builder.label" name="label" {...props}  />
);

export default FBLabelEditor;
