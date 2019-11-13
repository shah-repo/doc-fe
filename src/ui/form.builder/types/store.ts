import { FBEditorElementType } from "./editor";

export interface FBTemplateSchema {
  type: FBEditorElementType | string;
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
  autocompleteValue?: string;
  isMulti?: boolean;
  fieldName?: string;
  linkUrl?: string;
  validatorGroup?: string;
  schema?: Array<Partial<FBTemplateSchema>>;
}

export type FBDocumentRevisionMode =
  | "none"
  | "create"
  | "update"
  | "preview"
  | "outputCreate"
  | "outputPreview";
