import { Box } from "@material-ui/core";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBTextEditorProps } from "..";
import { withFBTextEditor } from "./FBTextEditor.wrap";

const FBTextEditor: React.FunctionComponent<FBTextEditorProps> = ({
  onEditorStateChange,
  editorState,
  disabled,
  name,
  ...props
}) => (
  <FBInput {...props} {...{ name, disabled }} type="texteditor">
    <Box mt={-4}>
      <Editor
        {...{ editorState, onEditorStateChange }}
        toolbarClassName="toolbarClassName"
        wrapperClassName="rte-wrapper"
        editorClassName="rte-editor"
        readOnly={disabled}
      />
    </Box>
  </FBInput>
);

export default withFBTextEditor(FBTextEditor);
