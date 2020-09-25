import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBTextEditorProps, FBTextEditorState } from "..";

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
    formValue,
    toolbar,
    masked,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { formState } = FB.useStores();
    formValue = formState?.getFieldValue(name);
    const emptyHtmlContent = "<p></p>";
    textEditorState = FB.useRef(FBTextEditorState, htmlToEditorState(formValue));

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
          formState?.setFieldValue(name, htmlContent);
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
    };

    onOptionsChange = (value: string) => {
      formState?.setFieldValue(`fb-texteditor-options-${name}`, undefined);
      onEditorStateChange?.(htmlToEditorState(value));
    };

    onBlur = () => {
      // If onBlur method is called from options menu open trigger
      if (textEditorState?.preserveFocus) { return; }
      handleMask?.(true);
    };

    // MARK: @observer
    useObserver(() => {
      editorState = textEditorState?.editorState;
      masked = textEditorState?.masked;
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
      formValue,
      toolbar,
      masked,
      name,
    });
  };

  Comp.displayName = "withFBTextEditor";
  return Comp;
};
