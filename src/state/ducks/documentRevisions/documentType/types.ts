import { FBSchemaProps } from "../../../../ui/form.builder";
import { Nullable } from "../../common";
import { DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_LIST } from "./constants";

export type DocumentGroupType = "FORM" | "OTHER" | "RECORD" | "DAM" | "MPI" | "DYNAMIC_FORM" | "POAM" | "PO" | "WORK_ORDER";
export type DocumentGroupOptionsType =
  "FORM" |
  "DAM" |
  "CAN_BE_OUTPUT" |
  "MUST_BE_OUTPUT" |
  "HAVE_OUTPUT" |
  "RECORD" |
  "ONE_ITEM" |
  "DYNAMIC_FORM" |
  "POAM" |
  "PO" |
  "WORK_ORDER" |
  "WO_PARTS";
export interface PageDetailsColumn {
  label: string;
  sourcePath: string;
  valuePath: string;
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
  groupOptions?: DocumentGroupOptionsType[];
  pageDetails?: Nullable<PageDetails>;
  isQms: boolean;
  defaultTraining: boolean;
  schema?: FBSchemaProps[];
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

export enum DynamicUIDocTypes {
  PO = "PO",
  RC = "RC",
  SUP = "SUP",
  WO = "WO",
  DAM = "DAM",
  POAM = "POAM",
}
