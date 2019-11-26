import { SelectOption } from "../../components/forms/fields/Select";
import { FBEditorElementType } from "./editor";
import { FBValidatorDelimiter } from "./validation/validator";

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
  options?: string | string[] | SelectOption[];
  includeNote?: boolean;
  optionNote?: string;
  autocompleteId?: string;
  isMulti?: boolean;
  linkUrl?: string;
  rules?: string;
  validatorDelimiter?: FBValidatorDelimiter;
  hasSchemaItem?: boolean;
  fieldName?: string;
}

export type FBDocumentRevisionMode =
  | "none"
  | "create"
  | "update"
  | "preview"
  | "outputCreate"
  | "outputPreview";
