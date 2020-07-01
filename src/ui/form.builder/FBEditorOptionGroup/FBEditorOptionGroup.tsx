import React from "react";
import { FBEditor, FBEditorOptions, FBEditorPlaceholder, FBEditorProps, FBTextField } from "..";

const FBEditorOptionGroup: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    {type === "select" && (
      <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`} />
    )}
    <FBEditorOptions key={`fb-editor-options-${type}-${index}`} />
    {children}
  </FBEditor>
);

export default FBEditorOptionGroup;
