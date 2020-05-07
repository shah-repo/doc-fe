import React from "react";
import { FBTextField, FBTextFieldProps } from "..";

const FBEditorOptions: React.FunctionComponent<FBTextFieldProps> = ({
  ...props
}) => (
  <FBTextField
    label="form.builder.options"
    name="options"
    rows={5}
    multiline
    rules="required"
    FBProps={{ inputType: "editoroptions" }}
    placeholder="form.builder.options.placeholder"
  />
);

export default FBEditorOptions;
