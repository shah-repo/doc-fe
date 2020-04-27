import React from "react";
import { FBEditor, FBEditorProps, FBTextEditor } from "..";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const FBEditorParagraph: React.FunctionComponent<FBEditorProps> = ({
  children,
  index,
  type,
}) => (
  <FBEditor {...{ type, index }}>
    <FBTextEditor name="paragraph" />
    {children}
  </FBEditor>

);

export default FBEditorParagraph;
