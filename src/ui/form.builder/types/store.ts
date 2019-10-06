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
  disabled: boolean;
}

export interface FBStoreProps {
  formBuilderStore: FBStore;
}
