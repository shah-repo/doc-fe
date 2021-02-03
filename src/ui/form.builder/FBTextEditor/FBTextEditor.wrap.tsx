import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isEmpty } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
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
    isPreview,
    formValue,
    toolbar,
    masked,
    name = "",
    disabled,
    isInputOwner,
    ...props
  }: T) => {

    // MARK: @config
    const { formState, workspaceState } = FB.useStores();
    const emptyHtmlContent = "<p></p>";
    const intl = useIntl();
    formValue = formState?.getFieldValue(name);
    textEditorState = FB.useRef(FBTextEditorState, htmlToEditorState(formValue));

    // form preview mode just disables the text editor
    // preview mode pulls a new style
    isPreview = formState?.workspaceMode === "preview";

    // Default value for preview mode
    if (!formValue && isEmpty(formValue) && isPreview) {
      formValue = intl.formatMessage({ id: "form.builder.none" });
    }
    const {
      document,
      externalState: { auth: { user: { employeeId = "" } = {} } = {} } = {},
    } = workspaceState || {};


    const inputOwner = document?.inputOwners?.[name];
    isInputOwner = inputOwner === undefined ||
      inputOwner === employeeId;
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
      formState?.setFieldAutosave(name);
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
      isPreview,
      formValue,
      toolbar,
      masked,
      name,
      disabled,
    });
  };

  Comp.displayName = "withFBTextEditor";
  return Comp;
};
