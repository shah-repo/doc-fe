import { FBEditorState, FBFormProps, FBInputProps } from "..";

export type FBEditorMode = "config" | "validation";

export interface FBEditorModeProps {
  mode: FBEditorMode;
  label: string;
}

export type FBEditorProps =
& Pick<FBFormProps, "children">
& {
  mode?: FBEditorMode;
  editorState?: FBEditorState;
  underValidation?: boolean;
  includeDefaultValue?: boolean;
  inputProps?: FBInputProps;
  standalone?: boolean;
};

export interface FBEditorHelperProps {
  openEditor?: (props?: Partial<FBInputProps>) => any;
}
