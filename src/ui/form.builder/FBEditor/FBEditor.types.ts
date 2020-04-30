import { FBEditorState, FBInputProps } from "..";
import { FBFormProps } from "../FBForm";

export type FBEditorMode = "config" | "validation";

export interface FBEditorModeProps {
  mode: FBEditorMode;
  label: string;
}

export type FBEditorProps =
& Pick<FBFormProps, "children" | "initialValues">
& {
  mode?: FBEditorMode;
  editorState?: FBEditorState;
  underValidation?: boolean;
  includeDefaultValue?: boolean;
  inputProps?: FBInputProps;
};

export interface FBEditorHelperProps {
  openEditor?: (props?: Partial<FBInputProps>) => any;
}
