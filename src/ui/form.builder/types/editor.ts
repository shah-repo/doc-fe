import { BoxProps } from "@material-ui/core/Box";
import { FBFormDefaultProps, Subtract } from "./common";
import { FBTemplateSchema } from "./store";

export interface FBEditorWrapperProps extends Omit<BoxProps, "fontSize">, Omit<FBFormDefaultProps, "onChange" | "defaultValue"> {
  indicatorVisibility?: "visible" | "hidden";
  toolbarMargin?: number;
  indicatorMargin?: number;
  removeSchemaItem?: () => any;
  editSchemaItem?: () => any;
  mdSchemaItem?: () => any;
  mdHidden?: boolean;
  schemaItem?: FBTemplateSchema;
}

export type FBEditorWrapperSubtractProps<T> = Subtract<
  T,
  Omit<FBEditorWrapperProps, "type" | "label" | "index">
>;

export type FBEditorWrapperStateProps = Pick<
  FBEditorWrapperProps,
  "visibility" | "toolbarMargin" | "indicatorMargin"
>;

export type FBEditorSectionType =
  | "section"
  | "basicFields"
  | "lists"
  | "groups";

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
  | "fileupload"
  | "schemaSelect"
  | "schemaItem"
  | "action";

export type FBEditorModeType = "create" | "update";

export interface FBEditorFormProps {
  type: FBEditorElementType;
  index: number;
  mode: FBEditorModeType;
}

export interface FBValidatorGroup {
  name: string;
  fields: Array<Partial<FBTemplateSchema>>;
}
