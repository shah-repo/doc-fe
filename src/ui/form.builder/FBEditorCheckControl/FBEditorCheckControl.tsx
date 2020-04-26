import React from "react";
import { FBEditor, FBEditorProperties, FBEditorProps, FBTextField } from "..";

const FBEditorCheckControl: React.FunctionComponent<FBEditorProps> = ({
  children,
  index,
  type,
}) => (
  <FBEditor {...{ type, index }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorProperties key={`fb-editor-prop-${type}-${index}`} {...{ type }} />
    {children}
  </FBEditor>
);

export default FBEditorCheckControl;
