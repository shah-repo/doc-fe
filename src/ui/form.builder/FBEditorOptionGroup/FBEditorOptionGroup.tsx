import React from "react";
import { FBEditor, FBEditorOptions, FBEditorProperties, FBEditorProps, FBTextField } from "..";

const FBEditorOptionGroup: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorOptions key={`fb-editor-options-${type}-${index}`} />
    <FBEditorProperties key={`fb-editor-props-${type}-${index}`} {...{ type }} />
    {children}
  </FBEditor>
);

export default FBEditorOptionGroup;
