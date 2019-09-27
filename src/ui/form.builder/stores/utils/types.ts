import { DocumentRevisionType } from "../../../../state/ducks/documentRevisions";
import { FBBasicFieldEditorType } from "../../main/editor/utils/types";

export interface FBTemplateSchema {
  type: FBBasicFieldEditorType;
  name: string;
  label: string;
  placeholder: string;
  rows: number;
}

export interface FBTemplateStore {
  name: string | null;
  documentType: DocumentRevisionType | null;
  documentId?: string;
  schema: FBTemplateSchema[];
  setState: (values: FBTemplateStore) => any;
  namePrefix: () => string;
  generateSchemaEl: (type: FBBasicFieldEditorType, values: any) => FBTemplateSchema;
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
