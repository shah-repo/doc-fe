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
}) =>


  // const state = { editorState: EditorState.createEmpty()  };
  // state.editorState.getCurrentContent().get
  // const onChange = (editorState) => {
  //   // this.setState({editorState})
  //   setValue(editorState);
  //   console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())).trim());
  // };
  // const [value, setValue] = React.useState<EditorState>();
  (
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
