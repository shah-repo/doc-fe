
import { Box, Fade } from "@material-ui/core";
import { isUndefined, truncate } from "lodash";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useIntl } from "react-intl";
import { SMTextEditorProps } from "../../..";
import { convertHtmlEntities } from "../../../../common/utils/helpers";
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
}) => {
  const [btnText, setBtnText] = useState("document.revision.view.more");
  const [editor, setEditor] = useState<string>("");
  const [flag, setFlag] = useState(true);
  const [hover, setHover] = useState(false);
  const intl = useIntl();
  const descriptionPlaceholder = intl.formatMessage({ id: "form.builder.enter.description" });
  const viewMore = intl.formatMessage({ id: "document.revision.view.more" });
  const viewLess = intl.formatMessage({ id: "document.revision.view.less" });

  const toggleBtn = () => {
    setFlag(!flag);
    if (flag) {
      setBtnText(viewMore);
    } else {
      setBtnText(viewLess);
    }
    setTimeout(() => {
      const headerTmpl = document.getElementById("SMHeaderTmpl");
      const bodyTmpl = document.getElementById("SMBodyTmpl");
      const restHeight = headerTmpl?.clientHeight ? 150 + (+(headerTmpl?.clientHeight)) : 200;
      bodyTmpl && (bodyTmpl.style.height = `calc(100vh - ${restHeight}px)`);
    }, 100);
  };
  // const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  // const isCreateForm = isCreateUrl && !_formState?.getValue(name);
  return  (
    <Box
      {...boxProps}
      data-cy={dataCy || name || label}
      flexDirection="row"
      fontFamily="Sora"
      fontWeight={600}
      color={Colors.almost_black}
      fontSize= "12px"
    >
      <Observer>
        {() => (
          <Box
            bgcolor={isPreview ? "transparent" : "white"}
            border={(isPreview || _textEditorState?.masked) ? 0 : `1px solid ${Colors.dodger_blue}`}
            borderColor={Colors.hint_gray}
            borderRadius={4}
            style={{ display: "grid" }}
            minHeight= {_textEditorState?.masked ? 30 : 80}

          >
            <Box
              display="flex"
              style={{ gridArea: "1/1" }}
              borderRadius={4}
              maxHeight= {150}
              overflow= "auto"
            >
              <Observer>
                {() => (
                  <Editor
                    onBlur={(ev) => onBlur?.(ev)}
                    {...{ editorRef, onEditorStateChange, toolbar }}
                    editorState={_textEditorState?.editorState}
                    readOnly={disabled}
                    toolbarHidden={_textEditorState?.masked}
                    toolbarStyle={{
                      border: "none",
                      borderBottom: `1px solid ${Colors.hint_gray}`,
                    }}
                    editorStyle={{
                      padding: "0 13px",
                      overflow: "auto",
                      display: _textEditorState?.masked ? "none" : "",
                      width: "100%",
                      height: "150px",
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
                    bgcolor={isPreview ? "transparent" : "white"}
                    borderRadius={4}
                    display="flex"
                    style={{
                      gridArea: "1/1",
                      cursor: !disabled ? "pointer" : "inherit",
                      backgroundColor: ((hover || _textEditorState?.masked) ? Colors.alabaster : Colors.white),
                    }}
                    maxHeight= {150}
                    overflow= "auto"
                    p={(isPreview || _textEditorState?.masked) ? 0 : 1.5}
                    {...!disabled && { onClick: () => { handleMask?.(false); setFlag(!flag); } }}
                    onMouseOver={() => setHover(true)}
                    onMouseOut={() => setHover(false)}
                  >
                    <Observer>
                      {() => {
                        const editedValue = _formState?.getValue(name) ?
                          convertHtmlEntities(_formState?.getValue(name).replace(/(<([^>]+)>|\/n)/g, " ")) :
                          descriptionPlaceholder;

                        const completeText = () => {
                          setEditor(editedValue);
                        };
                        const getTruncatText = () => {
                          const truncatedText = truncate(editedValue, {
                            length: 100,
                            separator: " ",
                          });
                          setEditor(truncatedText);
                        };
                        if (flag) {
                          getTruncatText();
                          setBtnText(viewMore);
                        } else {
                          completeText();
                          setBtnText(viewLess);
                        }
                        return (
                          <Box
                            bgcolor={hover ? Colors.whitest_grey : Colors.alabaster}
                            width="100%"
                            minHeight="32px"
                            alignItems="center"
                            display="flex"
                            justifyContent="flex-start"
                            borderRadius={4}
                            paddingLeft={1.375}
                          >
                            <>
                              <span
                                style={{
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  color: _formState?.getValue(name) ? Colors.almost_black : Colors.lightest_grey2,
                                  lineHeight: "25px",
                                  cursor: "pointer",
                                }}
                                id={`field-${name}`}
                                data-cy={`field-${name}`}
                              >
                                {editor?.trim()}
                              </span>
                              {_formState?.getValue(name) && <span
                                style={{
                                  color: Colors.navy,
                                  padding: "0 2px",
                                  fontFamily: "Sora",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                  display: editedValue?.length < 100 ? "none" : "",
                                }}
                                onClick={(ev) => { ev.stopPropagation(); toggleBtn(); }}>
                                {btnText}
                              </span>
                              }
                            </>
                          </Box>
                        );
                      }
                      }
                    </Observer>
                  </Box>
                </FBConditionalWrapper>
              )}
            </Observer>
          </Box>
        )}</Observer>
    </Box>
  );
};

export default withSMTextEditor(SMTextEditor);
