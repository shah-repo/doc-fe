import { BoxProps } from "@material-ui/core/Box";
import { FBFormDefaultProps, Subtract } from "./common";

export interface FBEditorWrapperProps extends BoxProps, FBFormDefaultProps {
  indicatorVisibility?: "visible" | "hidden";
  toolbarMargin?: number;
  indicatorMargin?: number;
  removeSchemaItem?: () => any;
  editSchemaItem?: () => any;
}

export type FBEditorWrapperSubtractProps<T> = Subtract<
  T,
  Omit<FBEditorWrapperProps, "type" | "label" | "index">
>;

export type FBEditorWrapperStateProps = Pick<
  FBEditorWrapperProps,
  "visibility" | "toolbarMargin" | "indicatorMargin"
>;

export type FBEditorSectionType = "section" | "basicFields" | "lists";

export type FBEditorElementType =
  | "textfield"
  | "checkbox"
  | "checkboxgroup"
  | "section"
  | "subsection"
  | "datepicker"
  | "texteditor"
  | "select"
  | "radio"
  | "radiogroup"
  | "autocomplete"
  | "hyperlink"
  | "fileupload";

export type FBEditorModeType = "create" | "update";

export interface FBEditorFormProps {
  type: FBEditorElementType;
  index: number;
  mode: FBEditorModeType;
}
