
import { Box, Button, ClickAwayListener } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useIntl } from "react-intl";
import { SMTextEditorProps } from "../../..";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { SMEditorStyles } from "./SMTextEditor.styles";
import { withSMTextEditor } from "./SMTextEditor.wrap";


const SMTextEditor: React.FunctionComponent<SMTextEditorProps> = ({
  onEditorStateChange,
  handleMask,
  onBlur,
  editorRef,
  _textEditorState,
  _documentRevisionFormState,
  _formState,
  boxProps,
  loading,
  label,
  dataCy,
  name,
  isPreview,
  toolbar,
  disabled,
  placeholder,
  showToggleButton,
  isTextClamped,
}) => {
  const classes = SMEditorStyles();
  const intl = useIntl();
  const [hover, setHover] = useState(false);
  const descriptionPlaceholder = intl.formatMessage({ id: "form.builder.enter.description" });
  const viewMore = intl.formatMessage({ id: "document.revision.view.more" });
  const viewLess = intl.formatMessage({ id: "document.revision.view.less" });
  const toggleBtn = () => {
    _textEditorState?.setPreviewMode(!_textEditorState?.previewMode);
    _documentRevisionFormState?.setDescriptionFocused(!_documentRevisionFormState?.isDescriptionFocused);
    _documentRevisionFormState?.setExpanded(!_documentRevisionFormState?.expanded);
  };
  const onAway = () => {
    _documentRevisionFormState?.setExpanded(false);
    _documentRevisionFormState?.setDescriptionFocused(false);
    _textEditorState?.setPreviewMode(true);
    showToggleButton && showToggleButton();
  };
  return  (
    <Box
      {...boxProps}
      data-cy={dataCy || name || label}
      flexDirection="row"
      fontWeight={600}
      color={Colors.almost_black}
      fontSize= "12px"
    >
      <Observer>
        {() => (
          <Box>
            <ClickAwayListener onClickAway={onAway} mouseEvent="onMouseDown">
              <Box
                borderColor={Colors.hint_gray}
                borderRadius={4}
                bgcolor={hover ? Colors.whitest_grey : "transparent"}
                style={{ display: "grid" }}
                minHeight= {_textEditorState?.masked ? 30 : 80}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <Box
                  style={{ gridArea: "1/1" }}
                  borderRadius={4}
                  data-cy={name}
                  bgcolor={_textEditorState?.previewMode ? "transparent" : Colors.white}
                >
                  <Observer>
                    {() => (
                      <Editor
                        onFocus={() => {
                          _textEditorState?.setPreviewMode(false);
                          _documentRevisionFormState?.setDescriptionFocused(true);
                          setTimeout(() => {
                            const moreThanTwoLines =
                                Math.floor(_textEditorState?.editorReference.editorContainer.clientHeight / 24) > 2;
                            _documentRevisionFormState?.setExpanded(moreThanTwoLines);
                          });
                        }}
                        onChange={() => showToggleButton && showToggleButton()}
                        onBlur={(ev) => onBlur?.(ev) }
                        {...{ editorRef, onEditorStateChange, toolbar }}
                        editorState={_textEditorState?.editorState}
                        toolbar={{
                          options: ["inline", "colorPicker", "list", "textAlign", "link", "remove", "history"],
                        }}
                        readOnly={disabled}
                        toolbarHidden={_textEditorState?.previewMode}
                        toolbarStyle={{
                          border: "none",
                          borderBottom: `1px solid ${Colors.hint_gray}`,
                          position: "sticky",
                          top: 0,
                          zIndex: 1000,
                        }}
                        editorStyle={{
                          padding: "0 11px",
                          width: "100%",
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: "24px",
                          height: "auto",
                        }}
                        toolbarClassName={classes.descriptionToolbarEditorClass}
                        editorClassName={_textEditorState?.previewMode ? classes.descriptionEditorClass :
                          classes.descriptionMainEditorClass}
                        placeholder={descriptionPlaceholder}
                        // fix for extra lines when pasting multiline content
                        stripPastedStyles={true}
                      />
                    )}
                  </Observer>
                </Box>
              </Box>
            </ClickAwayListener>
            {isTextClamped ? <Button variant="text"
              onClick={(ev) => { ev.stopPropagation(); toggleBtn(); }}
              style={{
                color: Colors.navy,
                padding: "0 2px",
                fontSize: "14px",
              }}>{viewMore}</Button> : (
              !_textEditorState?.previewMode && !isTextClamped && _documentRevisionFormState?.expanded && <Button variant="text"
                onClick={(ev) => { ev.stopPropagation(); toggleBtn(); }}
                style={{
                  color: Colors.navy,
                  padding: "0 2px",
                  fontSize: "14px",
                }}
              >{viewLess}</Button>)}
          </Box>
        )}</Observer>
    </Box>
  );
};

export default withSMTextEditor(SMTextEditor);
