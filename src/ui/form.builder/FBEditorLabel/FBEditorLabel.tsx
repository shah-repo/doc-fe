import React from "react";
import { FBEditor, FBEditorLabelProps, FBTextField } from "..";

const FBEditorLabel: React.FunctionComponent<FBEditorLabelProps> = ({
  index,
  type,
  children,
}) => (
  <FBEditor {...{ type, index }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    {children}
  </FBEditor>
);

export default FBEditorLabel;
