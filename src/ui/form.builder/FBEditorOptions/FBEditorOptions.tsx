import React from "react";
import { FBTextField, FBTextFieldProps } from "..";

const FBEditorOptions: React.FunctionComponent<FBTextFieldProps> = ({
  label = "form.builder.options",
  name = "options",
  placeholder = "form.builder.options.placeholder",
  rules = "required",
  className,
}) => (
  <FBTextField
    {...{ label, name, placeholder, rules, className }}
    rows={5}
    multiline
    boxProps={{ mb: 3.125 }}
    labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
    FBProps={{ inputType: "editoroptions" }}
  />
);

export default FBEditorOptions;
