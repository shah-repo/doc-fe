import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isEmpty } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBSelect, FBTextEditorProps, FBTextEditorState } from "..";

export const withFBTextEditor = <T extends FBTextEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onEditorStateChange,
    textEditorState,
    editorState,
    toolbarCustomButtons = [],
    toolbar,
    options,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
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

    options && !isEmpty(options) && (toolbarCustomButtons = [
      ...toolbarCustomButtons,
      ...[
        <>
          <FBSelect
            gutter={false}
            placeholder="form.builder.description.options"
            SelectDisplayProps={{ style: { padding: "5px 30px 5px 5px" } }}
            key={`fb-texteditor-desc-options-${name}`}
            name={`fb-texteditor-options-${name}`}
            onChange={handleOptionChange}
            {...{ options }}
          />
        </>,
      ],
    ]);

    function htmlToEditorState(value?: string): EditorState {
      if (!value) { return EditorState.createEmpty(); }
      const contentBlock = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }

    function handleOptionChange(ev: React.ChangeEvent<{ value: string }>) {
      formState?.setFieldValue(`fb-texteditor-options-${name}`, undefined, true);
      onEditorStateChange?.(htmlToEditorState(ev.target.value));
    }

    onEditorStateChange = (editorState: EditorState) =>
      textEditorState?.setEditorState(editorState);

    useObserver(() => {
      editorState = textEditorState?.editorState;
    });

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

    return Component({
      ...(props as T),
      onEditorStateChange,
      editorState,
      toolbarCustomButtons,
      toolbar,
      name,
    });
  };

  Comp.displayName = "withFBTextEditor";
  return Comp;
};
