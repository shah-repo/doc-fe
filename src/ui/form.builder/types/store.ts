import { FBStore } from "../stores/FBStore";
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

export interface FBStoreProps {
  formBuilderStore: FBStore;
}

export type FBDocumentRevisionMode =
  | "create"
  | "update"
  | "updateFromOther"
  | "createFrom";
