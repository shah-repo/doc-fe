import { FBEditorState, FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBEditorMode = "config" | "validation";

export interface FBEditorModeProps {
  mode: FBEditorMode;
  label: string;
}

export type FBEditorProps =
& Pick<FBFormProps, "children">
& Pick<FBProviderProps, "formState">
& {
  mode?: FBEditorMode;
  editorState?: FBEditorState;
  underValidation?: boolean;
  includeDefaultValue?: boolean;
  inputProps?: FBInputProps;
  standalone?: boolean;
  isFormOutput?: boolean;
};

export interface FBEditorHelperProps {
  openEditor?: (props?: Partial<FBInputProps>) => any;
}
