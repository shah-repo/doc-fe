import React from "react";
import { FBEditor, FBEditorPlaceholder, FBEditorProperties, FBEditorProps, FBTextField } from "..";

const FBEditorTextField: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`} />
    <FBTextField
      type="number"
      label="form.builder.rowNumber"
      defaultValue={1}
      name="rows"
      key={`fb-editor-${type}`}
    />
    <FBEditorProperties key={`fb-editor-props-${type}-${index}`} type="textfield" />
    {children}
  </FBEditor>
);

export default FBEditorTextField;
