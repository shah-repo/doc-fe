import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBTextEditorProps, FBTextEditorState } from "..";

export const withFBTextEditor = <T extends FBTextEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onEditorStateChange,
    textEditorState,
    editorState,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    textEditorState = FB.useRef(FBTextEditorState, formValue);

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
          const htmlContent = draftToHtml(convertToRaw(data.getCurrentContent())).trim();
          formState?.setFieldValue(name, htmlContent);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      onEditorStateChange,
      editorState,
      name,
    });
  };
  return (props: T) => Comp(props);
};
