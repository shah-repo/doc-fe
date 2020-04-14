import { FBEditorPropertiesState, FBInputProps, FBOptionProps } from "..";

export type FBEditorPropertiesType = "multiple" | "includeNone" | "includeContext";

export type FBEditorPropertiesProps =
& Pick<FBInputProps, "type">
& Pick<FBOptionProps, "options">
& {
  editorPropsState?: FBEditorPropertiesState;
};
