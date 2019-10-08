import { BoxProps } from "@material-ui/core/Box";

export interface FBEditorWrapperProps extends BoxProps {
  index: number;
}

export type FBEditorSectionType =
  | "section"
  | "basicFields"
  | "lists";

export type FBEditorElementType =
  | "textfield"
  | "checkbox"
  | "checkboxgroup"
  | "section"
  | "datepicker";

export interface FBEditorFormProps {
  type: FBEditorElementType;
  index: number;
}
