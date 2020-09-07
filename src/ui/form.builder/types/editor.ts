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
  | "purchaseorder"
  | "poreceive"
  | "paragraph"
  | "stepsection"
  | "instructionsmediaupload"
  | "evidencemediaupload"
  | "checkpoint"
  | "approval"
  | "createlabel"
  | "quantity"
  | "timer"
  | "inlineapproval"
  | "outputapproval"
  | "documentRevisions"
  | "approvalMatrix"
  | "poApprovalMatrix"
  | "instructionsdocument"
  | "selectdocument"
  | "teststep"
  | "testRequirement"
  | "selectrequirement"
  | "dynamiccontrol";

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
