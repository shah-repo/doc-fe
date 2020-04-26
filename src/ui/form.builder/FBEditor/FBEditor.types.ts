import { FBEditorState, FBInputProps } from "..";
import { FBFormProps } from "../FBForm";
import { FBInputType } from "../FBInput";

export type FBEditorMode = "config" | "validation";

export interface FBEditorModeProps {
  mode: FBEditorMode;
  label: string;
}

export type FBEditorProps =
& Pick<FBInputProps, "type" | "index">
& Pick<FBFormProps, "children" | "initialValues">
& {
  mode?: FBEditorMode;
  editorState?: FBEditorState;
};

export interface FBEditorHelperProps {
  openEditor?: (type: FBInputType, index?: number) => any;
}
