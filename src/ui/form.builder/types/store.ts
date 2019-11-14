import { FBShemaArrayProps } from "./common";
import { FBEditorElementType } from "./editor";

export interface FBTemplateSchema extends FBShemaArrayProps {
  type: FBEditorElementType | string;
  name: string;
  index: number;
  label: string;
  placeholder?: string;
  rows?: number;
  checkboxNote?: string;
  disabled?: boolean;
  includeOther?: boolean;
  options?: string | string[];
  includeNote?: boolean;
  optionNote?: string;
  autocompleteValue?: string;
  isMulti?: boolean;
  fieldName?: string;
  linkUrl?: string;
  validatorGroup?: string;
  metadata?: string;
}

export type FBDocumentRevisionMode =
  | "none"
  | "create"
  | "update"
  | "preview"
  | "outputCreate"
  | "outputPreview";
