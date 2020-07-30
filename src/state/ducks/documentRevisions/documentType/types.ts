import { FBSchemaProps } from "../../../../ui/form.builder";
import { Translation } from "../../../../ui/translations/types";
import { GroupTag } from "../../auth/types";
import { Nullable } from "../../common";
import { FBFormTemplateProps } from "../types";
import { DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_LIST, SET_DOCUMENT_TYPES_BY_CATEGORY } from "./constants";

export type DocumentGroupType =
  "FORM" |
  "OTHER" |
  "RECORD" |
  "DAM" |
  "MPI" |
  "DYNAMIC_FORM" |
  "POAM" |
  "PO" |
  "WORK_ORDER" |
  "SUPPLIER" |
  "PART";

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
  "WO_PARTS" |
  "CHANGE_REQUEST" |
  "BE_OUTPUT";
export interface PageDetailsColumn {
  label: Translation;
  sourcePath: string;
  valuePath: string;
}

export interface PageDetailsAddNew {
  label: string;
}

export interface PageDetails {
  addNewBtnLabel: string;
  columns: PageDetailsColumn[];
  category: string;
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
  fieldsConfig?: FieldConfig;
  hiddenForCreationForUsersWithoutTags?: GroupTag[];
}

export interface DocumentForms {
  id: string;
}

export interface DocumentTypeByIdForm {
  name: string;
  id: string;
  document: DocumentForms;
  formTemplate?: FBFormTemplateProps;
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

export interface DocumentTypeByCategoryAction {
  type: typeof SET_DOCUMENT_TYPES_BY_CATEGORY;
  payload: DocumentType[];
}

export interface DocumentTypeByIdState {
  [key: string]: DocumentType;
}

export type DocRevByIdState = DocumentTypeById;

export type DocumentTypeAllIdsState = string[];

export type DocumentTypeByCategoryState = DocumentType[];

export type FieldConfig = { [key in FieldType]?: IFieldConfigItem };

export interface IFieldConfigItem {
  visible: boolean;
  required?: boolean;
  label?: string;
}

export enum InputFieldType{
  TITLE = "C",
  DESCRIPTION = "D",
  DOC_TYPE = "E",
  DOC_ID = "F",
  TRAINING = "G",
  ATTACHMENTS = "H",
  REVISION_SELECTION = "M",
  NEXT_REVISION = "I",
  NEXT_REVISION_STAGE = "J",
  OBSOLETE = "K",
  ADM_CHANGE = "L",
  ASSIGN_DOCUMENT = "U"
}

export enum DisplayFieldType{
  STATUS = "A",
  STATUS_DRAFT = "A1",
  STATUS_OBSOLETE = "A2",
  STATUS_DEPRECATED = "A3",
  STATUS_RELEASED = "A4",
  STATUS_IN_REVIEW = "A5",
  STATUS_PENDING_CHANGE = "A6",
  DOC_ID = "B",
  APPROVE_RELEASE_BTN = "N",
  VERSIONS = "O",
  VERSION = "T",
  VERSION_DRAFT = "P1",
  VERSION_OBSOLETE = "P2",
  VERSION_DEPRECATED = "P3",
  VERSION_RELEASED = "P4",
  VERSION_IN_REVIEW = "P5",
  VERSION_PENDING_CHANGE = "P6",
  CR_ID = "R",
  REVISE_BTN = "S",
  BOOKMARKS = "Q",
  ADD_NEW_BTN = "V",
}

export type FieldType = InputFieldType | DisplayFieldType;
