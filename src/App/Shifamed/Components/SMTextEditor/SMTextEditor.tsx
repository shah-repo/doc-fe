
import { Box, CircularProgress, Fade } from "@material-ui/core";
import { hasIn, isString, isUndefined } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { FormattedMessage } from "react-intl";
import { SMTextEditorProps, SMTextLocaleProps } from "../../..";
import { FBConditionalWrapper } from "../../../../ui/form.builder";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMTextEditor } from "./SMTextEditor.wrap";

const SMTextEditor: React.FunctionComponent<SMTextEditorProps> = ({
  onEditorStateChange,
  handleMask,
  onBlur,
  editorRef,
  _textEditorState,
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
}) => (
  <Box
    {...boxProps}
    data-cy={dataCy || name || label}
    flexDirection="row"
  >
    <Box display="flex">
      {isString(label) && (
        <FormattedMessage id={label} />
      )}
      {hasIn(label, "locale") && (
        <FormattedMessage
          id={(label as SMTextLocaleProps).locale}
          values={(label as SMTextLocaleProps).values}
        />
      )}
      {loading && (
        <Box ml={1} mt={0.3}>
          <CircularProgress color="inherit" size={16} />
        </Box>
      )}
    </Box>
    <Box
      bgcolor={isPreview ? "transparent" : "white"}
      border={isPreview ? 0 : 1}
      borderColor={Colors.hint_gray}
      borderRadius={4}
      style={{ display: "grid" }}
      minHeight={isPreview ? "auto" : 140}
    >
      <Box
        display="flex"
        style={{ gridArea: "1/1" }}
        borderRadius={4}
        data-cy={name}
      >
        <Observer>
          {() => (
            <Editor
              onBlur={(ev) => onBlur?.(ev)}
              {...{ editorRef, onEditorStateChange, toolbar, placeholder }}
              editorState={_textEditorState?.editorState}
              readOnly={disabled}
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
          )}
        </Observer>
      </Box>
      <Observer>
        {() => (
          <FBConditionalWrapper
            condition={!isUndefined(_textEditorState?.masked)}
            wrapper={(wrapperChildren) => (
              <Fade in={_textEditorState?.masked} mountOnEnter>
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
              <Observer>
                {() => (
                  <div
                    style={{ width: "100%", height: "100%" }}
                    dangerouslySetInnerHTML={{
                      __html: _formState?.getValue(name)?.replace(/<[^\/>]*>([\s]?)*<\/[^>]*>/g, "<p><br></p>" ) || "",
                    }}
                  />
                )}
              </Observer>

            </Box>
          </FBConditionalWrapper>
        )}
      </Observer>
    </Box>
  </Box>
);

export default withSMTextEditor(SMTextEditor);
