import React from "react";
import { FBTextField, FBTextFieldProps } from "..";

const FBEditorOptions: React.FunctionComponent<FBTextFieldProps> = ({
  label = "form.builder.options",
  name = "options",
  placeholder = "form.builder.options.placeholder",
  rules = "required",
}) => (
  <FBTextField
    {...{ label, name, placeholder, rules }}
    rows={5}
    multiline
    FBProps={{ inputType: "editoroptions" }}
  />
);

export default FBEditorOptions;
