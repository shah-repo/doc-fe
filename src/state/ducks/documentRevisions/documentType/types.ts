import { FBSchemaProps } from "../../../../ui/form.builder";
import { Translation } from "../../../../ui/translations/types";
import { GroupTag } from "../../auth/types";
import { Nullable } from "../../common/types";
import { FBFormTemplateProps } from "../types";
import { DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_LIST, SET_DOCUMENT_TYPES_BY_CATEGORY } from "./constants";

export enum REVISION_STAGE_OPTIONS {
  NUMERIC = "common.Numeric",
  ALPHA = "common.Alpha",
}

// Copied from BE repo: src/modules/documentTypes/documentType.entity.ts
export enum DOC_TYPE_GROUP {
  FORM = "FORM",
  OTHER = "OTHER",
  PI = "PI",
  RECORD = "RECORD",
  CHANGE_REQUEST = "CHANGE_REQUEST",
  DAM = "DAM",
  DYNAMIC_FORM = "DYNAMIC_FORM",
  POAM = "POAM",
  PO = "PO",
  WORK_ORDER = "WORK_ORDER",
  SUPPLIER = "SUPPLIER",
  PART = "PART",
  MATERIAL = "MATERIAL",
  RECEIVABLE = "RECEIVABLE",
  ENGINEERING_BUILD = "ENGINEERING_BUILD",
  EQUIPMENT = "EQUIPMENT",
  MAINTENANCE_RECORD = "MAINTENANCE_RECORD",
  FAI_INSPECTION = "FAI_INSPECTION",
  LOT = "LOT",
  PART_LOT = "PART_LOT",
  LHR = "LHR",
  NEW_COMPANY = "NEW_COMPANY",
  SEED_DOCUMENT = "SEED_DOCUMENT",
  PI_INSTANCE = "PI_INSTANCE",
}

export type DocumentGroupType = keyof typeof DOC_TYPE_GROUP;

// Copied from BE repo: src/modules/documentTypes/documentType.entity.ts
export enum DOC_TYPE_GROUP_OPTION {
  FORM = "FORM",
  DAM = "DAM", // this can only go to DAM group
  CAN_BE_OUTPUT = "CAN_BE_OUTPUT",
  MUST_BE_OUTPUT = "MUST_BE_OUTPUT",
  HAVE_OUTPUT = "HAVE_OUTPUT",
  RECORD = "RECORD",
  CHANGE_REQUEST = "CHANGE_REQUEST",
  ONE_ITEM = "ONE_ITEM",
  DYNAMIC_FORM = "DYNAMIC_FORM",
  POAM = "POAM",
  PO = "PO",
  WORK_ORDER = "WORK_ORDER",
  PART = "PART",
  SUPPLIER = "SUPPLIER",
  RECEIVABLE = "RECEIVABLE",
  CAN_BE_COPIED = "CAN_BE_COPIED",
  EQUIPMENT = "EQUIPMENT",
  MAINTENANCE = "MAINTENANCE",
  DOCUMENT = "DOCUMENT",
  EDITABLE_SCHEMA = "EDITABLE_SCHEMA",
  INSPECTION = "INSPECTION",
  FAI_INSPECTION = "FAI_INSPECTION",
  CAN_CREATE_INSPECTION = "CAN_CREATE_INSPECTION",
  SERIALIZED_CSV = "SERIALIZED_CSV",
  ENGINEERING_BUILD = "ENGINEERING_BUILD",
  COMPANY_BOOTSTRAP_ON_RELEASE = "COMPANY_BOOTSTRAP_ON_RELEASE",
  SEED = "SEED",
  OPERATOR_RELEASE = "OPERATOR_RELEASE",
  MPI_OUTPUT = "MPI_OUTPUT",
  MPI = "MPI",
  LHR = "LHR",
  REDLINE = "REDLINE",
  FB_DEFAULT_NOTES = "FB_DEFAULT_NOTES",
}
export type DocumentGroupOptionsType = keyof typeof DOC_TYPE_GROUP_OPTION;

export interface PageDetailsColumn {
  label: Translation;
  sourcePath: string;
  valuePath: string;
  showOnWeb: boolean;
  showOnAndroid: boolean;
}

export interface PageDetails {
  id: string;
  addNewBtnLabel: string;
  columns: PageDetailsColumn[];
  category: string;
  exportList: boolean;
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
  defaultRevStage?: string;
  hiddenForCreationForUsersWithoutTags?: GroupTag[];
  privateNumberPool?: boolean;
  canRedLine?: boolean;
  needsSignature?: boolean;
  startingNumber?: string;
  category?: string;
  active?: boolean;
}

interface DocumentForms {
  id: string;
}

export interface DocumentTypeByIdForm {
  name: string;
  id: string;
  document: DocumentForms;
  formInput?: Record<string, any>;
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

type FieldConfig = { [key in FieldType]?: IFieldConfigItem };

interface IFieldConfigItem {
  visible: boolean;
  required?: boolean;
  label?: string;
  tooltipConfig?: TooltipLabelConfig;
}

export interface TooltipLabelConfig {
  labelName: string;
  defaultLabel?: string;
  overriddenLabel: string;
  visibilityFlag?: string;
  requiredFlag?: string;
}


// Copied from BE repo: src/modules/documentTypes/interfaces/fieldConfig.interface.ts
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
  OPERATORS = "U",
}

// Copied from BE repo: src/modules/documentTypes/interfaces/fieldConfig.interface.ts
export enum DisplayFieldType{
  STATUS = "A",
  STATUS_DRAFT = "A1",
  STATUS_OBSOLETE = "A2",
  STATUS_DEPRECATED = "A3",
  STATUS_RELEASED = "A4",
  STATUS_IN_REVIEW = "A5",
  STATUS_PENDING_CHANGE = "A6",
  STATUS_APPROVED = "A7",
  STATUS_SUBMITTED = "A8",
  STATUS_CANCELED = "A9",
  STATUS_VOIDED = "A10",
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
  VERSION_APPROVED = "P7",
  VERSION_SUBMITTED = "P8",
  VERSION_CANCELED = "P9",
  VERSION_VOIDED = "P10",
  CR_ID = "R",
  REVISE_BTN = "S",
  BOOKMARKS = "Q",
  ADD_NEW_BTN = "V",
}

export type FieldType = InputFieldType | DisplayFieldType;
