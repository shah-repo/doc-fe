import { FBEditorElementType } from "./editor";

export interface FBTemplateSchema {
  type: FBEditorElementType;
  name: string;
  index: number;
  label: string;
  placeholder?: string;
  rows?: number;
  checkboxNote?: string;
  disabled?: boolean;
  includeOther?: boolean;
  options?: string;
  includeNote?: boolean;
  optionNote?: string;
  autocompleteList?: string;
  isMulti?: boolean;
  fieldName?: string;
  linkUrl?: string;
}

export type FBDocumentRevisionMode =
  | "none"
  | "create"
  | "update"
  | "preview"
  | "outputCreate"
  | "outputPreview";
