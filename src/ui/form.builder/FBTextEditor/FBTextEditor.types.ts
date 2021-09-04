import { EditorProps } from "react-draft-wysiwyg";
import { FBInputProps, FBTextEditorState } from "..";

export type FBTextEditorProps =
& FBInputProps
& Pick<EditorProps, "editorState" | "onEditorStateChange" | "toolbar">
& {
  editorRef?: (ref: HTMLInputElement) => void;
  handleMask?: (masked: boolean) => void;
  onOptionsChange?: (value: string) => void;
  onBlur?: (ev: any) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  textEditorState?: FBTextEditorState;
  editorReference?: HTMLInputElement;
  formValue?: string;
  masked?: boolean;
  isPreview?: boolean;
  shouldNotAutosaveOnBlur?: boolean;
};
