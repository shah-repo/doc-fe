import React from "react";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FBTextEditorField from "../components/inputs/FBTextEditorField";

const FBEditorParagraph: React.FunctionComponent<{}> = () => (
  <FBTextEditorField name="paragraph" />
);

export default FBEditorParagraph;
