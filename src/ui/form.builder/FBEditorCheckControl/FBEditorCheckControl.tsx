import React from "react";
import { FBEditor, FBEditorProperties, FBEditorProps, FBTextField } from "..";

const FBEditorCheckControl: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorProperties key={`fb-editor-prop-${type}-${index}`} type="checkbox" />
    {children}
  </FBEditor>
);

export default FBEditorCheckControl;
