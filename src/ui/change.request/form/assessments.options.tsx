import { EditorState, Modifier } from "draft-js";
import React from "react";

// WORKAROUND: couldn't find the interface for the props that are injected here
// https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/Editor/index.js#L470
interface Props {
  onChange?: (editorState: EditorState) => void;
  editorState?: EditorState;
}

const AssessmentsOptions: React.FunctionComponent<Props> = ({
  editorState,
  onChange,
}) => {
  const assessmentOptions = (): void => {
    const contentState = Modifier.replaceText(
      editorState!.getCurrentContent(),
      editorState!.getSelection(),
      "⭐",
      editorState!.getCurrentInlineStyle(),
    );
    onChange!(EditorState.push(editorState!, contentState, "insert-characters"));
  };

  return (
    <div onClick={assessmentOptions}>
      Test
    </div>
  );
};

export default AssessmentsOptions;
