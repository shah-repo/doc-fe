import React from "react";
import { FBEditor, FBEditorLabel, FBEditorProperties, FBEditorProps } from "..";

const FBEditorCheckControl: React.FunctionComponent<FBEditorProps> = ({
  children,
  index,
  type,
}) => (
  <FBEditor {...{ type, index }}>
    <FBEditorLabel key={`fb-editor-label-${type}-${index}`} />
    <FBEditorProperties key={`fb-editor-prop-${type}-${index}`} {...{ type }} />
    {children}
  </FBEditor>
);

export default FBEditorCheckControl;
