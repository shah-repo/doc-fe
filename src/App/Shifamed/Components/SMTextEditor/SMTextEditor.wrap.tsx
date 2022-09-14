import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useFormikContext } from "formik";
import htmlToDraft from "html-to-draftjs";
import { map } from "lodash";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { SM, SMTextEditorProps, SMTextEditorState, SMTextLocaleProps } from "../../..";
import { FB } from "../../../../ui/form.builder";
import { useFormContext } from "../../../../ui/components/forms/FormContext";

export const withSMTextEditor = <T extends SMTextEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onEditorStateChange,
    handleMask,
    onBlur,
    editorRef,
    _textEditorState,
    showToggleButton,
    label,
    isPreview,
    formValue,
    toolbar,
    masked,
    name = "",
    ...props
  }: T) => {
    // MARK: @config
    const intl = useIntl();
    const [isTextClamped, setIsTextClamped] = useState(false);
    const formik = useFormikContext();
    const { submitForm } = useFormContext();
    const { _formState, _documentRevisionFormState } = SM.useStores();
    const { workspaceState } = FB.useStores();
    formValue = _formState?.getValue(name);
    _textEditorState = SM.useRef(SMTextEditorState, htmlToEditorState(formValue));
    const emptyHtmlContent = "<p></p>";

    !toolbar && (toolbar = {
      options: [
        "inline",
        "blockType",
        "fontSize",
        "fontFamily",
        "list",
        "textAlign",
        "colorPicker",
        "link",
        "remove",
        "history",
      ],
      inline: { options: ["bold", "italic", "underline", "monospace"] },
    });

    showToggleButton = () => {
      setTimeout(() => {
        const elm = document.querySelector(".rdw-editor-main");
        const isClamped = elm ? elm.scrollHeight > elm.clientHeight : false;
        setIsTextClamped(isClamped);
        _documentRevisionFormState?.setIsDescTextClamped(isClamped);
      }, 500);
    };

    useMemo(
      () => {
        const intlValues = (label as SMTextLocaleProps).values;
        map(intlValues, (value, key) => intlValues[key] = intl.formatMessage({ id: value }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    SM.reaction(
      () => _documentRevisionFormState?.isDirty,
      (isDirty: boolean | undefined) => {
        workspaceState?.setDirty(isDirty || false);
      }
    );

    // MARK: @state

    // MARK: @reactions
    SM.reaction(
      () => _formState?.getValue(name),
      (value) => {
        const editorState = htmlToEditorState(value);
        _textEditorState?.setEditorState(editorState);
        showToggleButton && showToggleButton();
      }
    );
    // MARK: @helpers
    // Creates editor state with initial value
    function htmlToEditorState(value?: string): EditorState {
      if (!value) { return EditorState.createEmpty(); }
      const contentBlock = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }

    // MARK: @methods
    onEditorStateChange = (editorState: EditorState) =>
    _textEditorState?.setEditorState(editorState);

    handleMask = (masked: boolean) => {
      if (!_textEditorState?.editorReference) { return; }
      !masked && _textEditorState.editorReference.focus();
      _textEditorState?.setMasked(masked);
    };

    onBlur = () => {
      handleMask?.(true);
      const editorState = _textEditorState?.editorState;
      if (!editorState) { return; }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent())).trim();
      (htmlContent === emptyHtmlContent) && (htmlContent = "");
      if (_formState?.getValue(name) === htmlContent) { return; }
      formik.setFieldValue(name, htmlContent);
      _formState?.setValue(name, htmlContent);
      submitForm();
    };

    editorRef = (ref) =>
      _textEditorState && (_textEditorState.editorReference = ref);

    return  Component({
      ...(props as T),
      onEditorStateChange,
      handleMask,
      onBlur,
      editorRef,
      _textEditorState,
      _formState,
      name,
      label,
      formValue,
      toolbar,
      showToggleButton,
      isTextClamped,
      _documentRevisionFormState,
    });
  };
  Comp.displayName = "withSMTextEditor";
  return Comp;
};
