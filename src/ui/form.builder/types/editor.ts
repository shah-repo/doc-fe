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
  | "zipattachment"
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
  | "approvalRoles"
  | "poApprovalMatrix"
  | "instructionsdocument"
  | "selectdocument"
  | "teststep"
  | "dynamiccontrol";

export type FBEditorModeType = "create" | "update";

export interface FBEditorFormProps {
  type: FBEditorElementType;
  index: number;
  mode: FBEditorModeType;
}
