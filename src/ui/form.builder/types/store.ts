import { FBStore } from "../stores/FBStore";
import { FBEditorElementType } from "./editor";

export interface FBTemplateSchema {
  type: FBEditorElementType;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  checkboxNote?: string;
}

export interface FBStoreProps {
  formBuilderStore: FBStore;
}
