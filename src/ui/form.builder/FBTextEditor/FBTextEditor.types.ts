import { EditorProps } from "react-draft-wysiwyg";
import { FBInputProps, FBTextEditorState } from "..";

export type FBTextEditorProps =
& FBInputProps
& Pick<EditorProps, "editorState" | "onEditorStateChange">
& {
  textEditorState?: FBTextEditorState;
};
