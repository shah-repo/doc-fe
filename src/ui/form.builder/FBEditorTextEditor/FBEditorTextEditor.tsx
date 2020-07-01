import React from "react";
import { FBEditor, FBEditorOptions, FBEditorProps, FBTextField } from "..";

const FBEditorTextEditor: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorOptions
      key={`fb-editor-options-${type}`}
      label="form.builder.description.options"
      placeholder="form.builder.description.options.placeholder"
      rules=""
    />
    {children}
  </FBEditor>
);

export default FBEditorTextEditor;
