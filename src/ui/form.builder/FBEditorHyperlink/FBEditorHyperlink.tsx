import React from "react";
import { FBEditor, FBEditorProps, FBTextField } from "..";

const FBEditorHyperlink: React.FunctionComponent<FBEditorProps> = ({
  children,
  index,
  type,
}) => (
  <FBEditor {...{ type, index }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBTextField
      type="url"
      label="URL"
      name="linkUrl"
      key={`fb-editor-${type}-${index}`}
    />
    {children}
  </FBEditor>
);

export default FBEditorHyperlink;
