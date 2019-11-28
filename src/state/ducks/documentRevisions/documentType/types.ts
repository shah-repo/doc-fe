import { DOCUMENT_TYPE_LIST } from "./constants";

export type DocumentGroupType = "FORM" | "OTHER";

export interface DocumentType {
  id: string;
  documentTypeAcronym: string;
  documentTypeName: string;
  group: DocumentGroupType;
}

export interface DocumentTypeListAction {
  type: typeof DOCUMENT_TYPE_LIST;
  payload: DocumentType[];
}

export interface DocumentTypeByIdState {
  [key: string]: DocumentType;
}

export type DocumentTypeAllIdsState = string[];
