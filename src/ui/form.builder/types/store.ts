import { DocumentRevisionType } from "../../../state/ducks/documentRevisions";
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

export interface FBTemplateStore {
  name: string | null;
  documentType: DocumentRevisionType | null;
  documentId?: string;
  schema: FBTemplateSchema[];
  setState: (values: FBTemplateStore) => any;
  namePrefix: () => string;
  generateSchemaEl: (type: FBEditorElementType, values: any) => FBTemplateSchema;
}

export interface FBFlowStore {
  mode: "view" | "form";
  documentId?: string;
  submitLabel: string;
  templateName: string | null;
  documentType?: DocumentRevisionType;
  values: {
    [key: string]: any;
  };
  setState: (values: FBFlowStore) => any;
}

export interface FBStoreProps {
  formBuilderStore: FBStore;
}
