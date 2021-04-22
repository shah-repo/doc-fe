import { Box, Fade } from "@material-ui/core";
import { isEmpty, isUndefined } from "lodash";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBConditionalWrapper, FBFieldName, FBInput, FBProvider, FBTextEditorOptions, FBTextEditorProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBTextEditor } from "./FBTextEditor.wrap";

const FBTextEditor: React.FunctionComponent<FBTextEditorProps> = ({
  onEditorStateChange,
  onOptionsChange,
  handleMask,
  editorRef,
  onBlur,
  onKeyDown,
  textEditorState,
  editorState,
  editorReference,
  isPreview,
  formValue = "",
  options = [],
  toolbar,
  disabled,
  masked,
  name,
  ...props
}) => {
  // hack for adding empty lines in preview mode
  // so there is no additional growing blank space on the bottom of editor
  // eslint-disable-next-line no-useless-escape
  const formattedFormValue = formValue.replace(/<[^\/>]*>([\s]?)*<\/[^>]*>/g, "<p><br></p>" );
  return (
    <div id={`${FBFieldName.MPIProcedureId}-${name}`}>
    <FBProvider {...{ textEditorState }}>
      <FBInput {...props} {...{ name, disabled }} type="texteditor">
        <Box
          bgcolor={isPreview ? "transparent" : "white"}
          border={isPreview ? 0 : 1}
          borderColor={Colors.hint_gray}
          borderRadius={4}
          style={{ display: "grid" }}
          minHeight={isPreview ? "auto" : 140}
          onKeyDown={(e) => onKeyDown?.(e as unknown as KeyboardEvent)}
        >
          <Box
            display="flex"
            style={{ gridArea: "1/1" }}
            borderRadius={4}
            data-cy={name}
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
              toolbarHidden={isPreview}
              toolbarStyle={{
                border: "none",
                borderBottom: `1px solid ${Colors.hint_gray}`,
              }}
              editorStyle={{
                height: "auto",
                padding: "0 13px",
                overflow: "hidden",
                visibility: isPreview ? "hidden" : "visible",
              }}
              // fix for extra lines when pasting multiline content
              stripPastedStyles={true}
            />
          </Box>
          <FBConditionalWrapper
            condition={!isUndefined(masked)}
            wrapper={(wrapperChildren) => (
              <Fade in={masked} mountOnEnter>
                {wrapperChildren}
              </Fade>
            )}
          >
            <Box
              {...!disabled && { onClick: () => handleMask?.(false) }}
              bgcolor={isPreview ? "transparent" : "white"}
              borderRadius={4}
              zIndex={1000}
              display="flex"
              style={{
                gridArea: "1/1",
                cursor: !disabled ? "text" : "inherit",
              }}
              p={isPreview ? 0 : 1.5}
            >
              <div
                style={{ width: "100%", height: "100%" }}
                dangerouslySetInnerHTML={{ __html: formattedFormValue }}
              />
            </Box>
          </FBConditionalWrapper>
        </Box>
      </FBInput>
    </FBProvider>
    </div>
  ); };

export default withFBTextEditor(FBTextEditor);
