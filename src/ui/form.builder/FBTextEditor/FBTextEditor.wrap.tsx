import { Timeout } from "aws-sdk/clients/lambda";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isEmpty } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { FB, FBTextEditorProps, FBTextEditorState } from "..";
import { useFormContext } from "../../components/forms/FormContext";

export const withFBTextEditor = <T extends FBTextEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onEditorStateChange,
    onOptionsChange,
    handleMask,
    editorRef,
    onBlur,
    textEditorState,
    editorState,
    editorReference,
    isPreview,
    formValue,
    toolbar,
    masked,
    name = "",
    disabled,
    isInputOwner,
    withState,
    omitFormValue,
    ...props
  }: T) => {

    // MARK: @config
    const intl = useIntl();
    let timeout;
    const [timeoutID, setTimeoutID] = useState<Timeout>();
    const { formState, workspaceState } = FB.useStores();
    const emptyHtmlContent = "<p></p>";
    textEditorState = FB.useRef(FBTextEditorState, htmlToEditorState(formValue));
    const { submitForm } = useFormContext();
    // form preview mode just disables the text editor
    // preview mode pulls a new style
    isPreview = formState?.workspaceMode === "preview";

    // Default value for preview mode
    if (!formValue && isEmpty(formValue) && isPreview) {
      formValue = intl.formatMessage({ id: "form.builder.none" });
    }

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

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

    // MARK: Reactions
    // On editor value change. This will sync changed value and form value.
    React.useEffect(() => {
      reaction(
        () => textEditorState?.editorState,
        (data) => {
          if (!data) { return; }
          let htmlContent = draftToHtml(convertToRaw(data.getCurrentContent())).trim();
          (htmlContent === emptyHtmlContent) && (htmlContent = "");
          formState?.setFieldValue(name, htmlContent, false, omitFormValue);
          formState?.validate();
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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
      textEditorState?.setEditorState(editorState);

    editorRef = (ref) =>
      textEditorState && (textEditorState.editorReference = ref);

    handleMask = (masked: boolean) => {
      if (!textEditorState?.editorReference) { return; }
      !masked && !textEditorState?.preserveFocus && textEditorState.editorReference.focus();
      textEditorState?.setMasked(masked);

      if (!masked) {
        timeout = setInterval(() => {
          submitForm();
        }, 30000);
        setTimeoutID(timeout);
      } else {
        clearInterval(timeoutID);
      }
    };

    onOptionsChange = (value: string) => {
      formState?.setFieldValue(`fb-texteditor-options-${name}`, undefined);
      onEditorStateChange?.(htmlToEditorState(value));
    };

    onBlur = () => {
      // If onBlur method is called from options menu open trigger
      if (textEditorState?.preserveFocus) { return; }
      handleMask?.(true);
      if (withState) {
        formState?.setFieldValue(name, formState.getFieldValue(name), true, omitFormValue);
      }
      formState?.setFieldAutosave(name);
    };

    // MARK: @observer
    useObserver(() => {
      editorState = textEditorState?.editorState;
      masked = textEditorState?.masked;
      formValue = formState?.getFieldValue(name);
    });

    return Component({
      ...(props as T),
      onEditorStateChange,
      onOptionsChange,
      handleMask,
      editorRef,
      onBlur,
      textEditorState,
      editorState,
      editorReference,
      isPreview,
      formValue,
      toolbar,
      masked,
      name,
      disabled,
      withState,
      omitFormValue,
    });
  };

  Comp.displayName = "withFBTextEditor";
  return Comp;
};
