import { Box, Fade } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBProvider, FBTextEditorProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBTextEditorOptions } from "../FBTextEditorOptions";
import { withFBTextEditor } from "./FBTextEditor.wrap";

const FBTextEditor: React.FunctionComponent<FBTextEditorProps> = ({
  onEditorStateChange,
  onOptionsChange,
  handleMask,
  editorRef,
  onBlur,
  textEditorState,
  editorState,
  editorReference,
  formValue = "",
  options = [],
  toolbar,
  disabled,
  masked,
  name,
  ...props
}) => (
  <FBProvider {...{ textEditorState }}>
    <FBInput {...props} {...{ name, disabled }} type="texteditor">
      <Box
        bgcolor="white"
        border={1}
        borderColor={Colors.hint_gray}
        borderRadius={4}
        style={{ display: "grid" }}
        minHeight={140}
      >
        <Box
          display="flex"
          style={{ gridArea: "1/1" }}
          borderRadius={4}
        >
          <Editor
            {...{ editorRef, editorState, onEditorStateChange, toolbar, onBlur }}
            {...!isEmpty(options) && {
              toolbarCustomButtons: [
                <FBTextEditorOptions
                  key={`fb-texteditor-options-${name}`}
                  {...{ options, onOptionsChange }}
                />,
              ],
            }}
            toolbarHidden={masked}
            toolbarStyle={{ border: "none" }}
            editorStyle={{
              height: "100%",
              padding: "0 13px",
              overflow: "hidden",
            }}
          />
        </Box>
        <Fade in={masked}>
          <Box
            {...!disabled && { onClick: () => handleMask?.(false) }}
            bgcolor="white"
            borderRadius={4}
            zIndex={1000}
            display="flex"
            style={{
              gridArea: "1/1",
              cursor: !disabled ? "text" : "inherit",
            }}
            p={1.5}
          >
            <div
              style={{ width: "100%", height: "100%" }}
              dangerouslySetInnerHTML={{ __html: formValue }}
            />
          </Box>
        </Fade>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBTextEditor(FBTextEditor);
