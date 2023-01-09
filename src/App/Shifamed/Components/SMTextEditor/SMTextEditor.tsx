
import { Box, Button, ClickAwayListener } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useIntl } from "react-intl";
import { SMTextEditorProps } from "../../..";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { editorStyles, SMEditorStyles } from "./SMTextEditor.styles";
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
          <Box
            bgcolor={hover && _textEditorState?.previewMode ? Colors.whitest_grey : "transparent"}
            borderRadius={4}
            paddingTop={_textEditorState?.previewMode ? 0.5 : 0}
            paddingBottom={_textEditorState?.previewMode ? 0.5 : 0}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <ClickAwayListener onClickAway={onAway} mouseEvent="onMouseUp">
              <Box
                borderColor={Colors.hint_gray}
                borderRadius={4}
                bgcolor={hover ? Colors.whitest_grey : "transparent"}
                style={{ display: "grid" }}
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
                        }}
                        onChange={() => showToggleButton && showToggleButton()}
                        {...{ onBlur, editorRef, onEditorStateChange, toolbar }}
                        editorState={_textEditorState?.editorState}
                        toolbar={{
                          options: ["inline", "colorPicker", "list", "textAlign", "link", "remove", "history"],
                        }}
                        readOnly={disabled}
                        toolbarHidden={_textEditorState?.previewMode}
                        toolbarStyle={editorStyles.toolbarStyle}
                        editorStyle={editorStyles.editorStyle}
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
              className={classes.moreOrLess}>{viewMore}</Button> : (
              !_textEditorState?.previewMode && !isTextClamped &&
               <Button variant="text"
                 onClick={(ev) => { ev.stopPropagation(); toggleBtn(); }}
                 className={classes.moreOrLess}
               >{viewLess}</Button>)}
          </Box>
        )}</Observer>
    </Box>
  );
};

export default withSMTextEditor(SMTextEditor);
