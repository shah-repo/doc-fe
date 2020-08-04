import { DocumentGroupType } from "./types";

export const DOCUMENT_TYPE_LIST = "documentType/LIST";

export const DOCUMENT_TYPE_LIST_ASYNC = "documentType/LIST_ASYNC";

export const DOCUMENT_TYPE_BY_ID = "documentType/ID";

export const DOCUMENT_TYPE_BY_ID_ASYNC = "documentType/ID_ASYNC";

export const DOCUMENT_TYPE_ROOT_URL = "/document_type";

export const DOCUMENT_TYPE_BY_GROUP_ASYNC = "documentType/GROUP_ASYNC";
export const DOCUMENT_TYPE_BY_CATEGORY_ASYNC = "documentType/CATEGORY_ASYNC";
export const SET_DOCUMENT_TYPES_BY_CATEGORY = "documentType/SET_CATEGORY";

export const RECORD_GROUP_TYPES: DocumentGroupType[] = ["PO", "SUPPLIER", "RECORD"];
export const DOCUMENT_GROUP_TYPES: DocumentGroupType[] = ["DAM", "DYNAMIC_FORM", "FORM", "MPI", "OTHER", "PART", "POAM", "WORK_ORDER"];

export const DOCUMENT_LIST_TYPE_NAMES = [
  "Clinical Document",
  "Clinical Protocol",
  "Clinical Report",
  "Indications for Use",
  "Product User Needs Document",
  "Requirements Document",
  "Design Document",
  "Risk Management Documents",
  "Method",
  "Protocol or plan",
  "Report",
  "Labeling",
  "Quality Specification",
  "Equipment Specification",
  "Non-product Software",
  "Supply Item",
  "Marketing",
  "Model / Catalog Number",
  "Administrative",
  "Quality Manual",
  "Quality Plan",
  "Standard Operating Procedure",
  "General Quality Document",
  "Work Instruction",
  "Training Curriculum",
  "Legal Document",
  "Business Document",
];
