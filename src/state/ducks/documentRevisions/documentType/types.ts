import { Nullable } from "../../common";
import { DOCUMENT_TYPE_LIST } from "./constants";
import { DocumentType } from "./types";

export type DocumentGroupType = "FORM" | "OTHER";

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
}

export interface DocumentTypeListAction {
  type: typeof DOCUMENT_TYPE_LIST;
  payload: DocumentType[];
}

export interface DocumentTypeByIdState {
  [key: string]: DocumentType;
}

export type DocumentTypeAllIdsState = string[];
