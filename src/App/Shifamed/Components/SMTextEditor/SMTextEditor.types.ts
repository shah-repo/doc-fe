import { BoxProps } from '@material-ui/core';
import { EditorProps, EditorState } from 'react-draft-wysiwyg';
import { SMProviderProps, SMTextLocaleProps } from '../../..';

export type SMTextEditorProps =
& Pick<EditorProps, 'editorState' | 'onEditorStateChange' | 'toolbar' | 'placeholder'>
& Pick<SMProviderProps, '_textEditorState' | '_formState' | '_documentRevisionFormState'>
& {
  handleMask?: (masked: boolean) => void;
  onBlur?: (ev: any) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  editorRef?: (ref: HTMLInputElement) => void;
  name?: string;
  boxProps?: BoxProps;
  loading?: boolean;
  dataCy?: string;
  label?: string | SMTextLocaleProps;
  formValue?: string;
  masked?: boolean;
  isPreview?: boolean;
  disabled?: boolean;
  showToggleButton?: () => void;
  isTextClamped?: boolean;
};

export interface SMTextEditorStateProps {
  setEditorState: (editorState?: EditorState) => void;
  setMasked: (masked?: boolean) => void;
  editorReference?: HTMLInputElement;
  editorState?: EditorState;
  masked?: boolean;
}
