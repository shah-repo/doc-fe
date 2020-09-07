import React from "react";
import { FBEditor, FBEditorProps, FBTextField } from "..";

const FBEditorHyperlink: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required" />
    <FBTextField
      type="url"
      label="URL"
      name="linkUrl"
      key={`fb-editor-${type}-${index}`}
      rules="required"
    />
    {children}
  </FBEditor>
);

export default FBEditorHyperlink;
