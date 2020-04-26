import React from "react";
import { FBEditor, FBEditorLabel, FBEditorOptions, FBEditorProperties, FBEditorProps } from "..";

const FBEditorOptionGroup: React.FunctionComponent<FBEditorProps> = ({
  index,
  type,
}) => (
  <FBEditor {...{ type, index }}>
    <FBEditorLabel key={`fb-editor-label-${type}-${index}`} />
    <FBEditorOptions key={`fb-editor-options-${type}-${index}`} />
    <FBEditorProperties key={`fb-editor-props-${type}-${index}`} {...{ type }} />
  </FBEditor>
);

export default FBEditorOptionGroup;
