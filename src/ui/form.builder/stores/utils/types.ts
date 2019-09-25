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
  schema: FBTemplateSchema[];
  setState: (values: FBTemplateStore) => any;
  namePrefix: () => string;
  generateSchemaEl: (type: FBBasicFieldEditorType, values: any) => FBTemplateSchema;
}

export interface FBFlowStore {
  mode: "view" | "form";
}
