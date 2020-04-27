import { Nullable } from "../../common";
import { DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_LIST } from "./constants";

export type DocumentGroupType = "FORM" | "OTHER" | "RECORD" | "DAM";

export interface PageDetailsColumn {
  label: string;
  fieldName: string;
}

export interface PageDetailsAddNew {
  label: string;
}

export interface PageDetails {
  addNew: PageDetailsAddNew;
  columns: PageDetailsColumn[];
}
export interface DocumentType {
  id: string;
  documentTypeAcronym: string;
  documentTypeName: string;
  group: DocumentGroupType;
  pageDetails?: Nullable<PageDetails>;
  isQms: boolean;
  defaultTraining: boolean;
}

export interface DocumentForms {
  id: string;
}

export interface DocumentTypeByIdForm {
  name: string;
  id: string;
  document: DocumentForms;
}

export interface DocumentTypeById {
  documentType: DocumentType;
  forms: DocumentTypeByIdForm[];
}

export interface DocumentTypeByIdAction {
  type: typeof DOCUMENT_TYPE_BY_ID;
  payload: DocumentTypeById;
}

export interface DocumentTypeListAction {
  type: typeof DOCUMENT_TYPE_LIST;
  payload: DocumentType[];
}

export interface DocumentTypeByIdState {
  [key: string]: DocumentType;
}

export type DocRevByIdState = DocumentTypeById;

export type DocumentTypeAllIdsState = string[];
