import { FBTemplateSchema } from "./store";

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
  | "action"
  | "hellosign"
  | "hellosignPremade"
  | "purchaseorder"
  | "paragraph"
  | "sectionnumbering"
  | "instructionsmediaupload"
  | "evidencemediaupload";

export type FBEditorModeType = "create" | "update";

export interface FBEditorFormProps {
  type: FBEditorElementType;
  index: number;
  mode: FBEditorModeType;
}

export interface FBValidatorGroup {
  name: string;
  fields: Partial<FBTemplateSchema>[];
}

export const omitLabelValidation: FBEditorElementType[] = [
  "action", "paragraph", "instructionsmediaupload", "evidencemediaupload",
];
