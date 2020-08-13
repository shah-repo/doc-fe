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
  "Administrative",
  "Business Document",
  "Business document.",
  "Business form",
  "Clinical Document",
  "Clinical Protocol",
  "Clinical Report",
  "Design Document",
  "Design and Development Records",
  "Device Master Record",
  "Equipment Specification",
  "Form",
  "General Quality Document",
  "Indications for Use",
  "Labeling",
  "Legal Document",
  "Legal Form",
  "Manufacturing Process Instruction",
  "Marketing",
  "Method",
  "Model / Catalog Number",
  "Non-product Software",
  "Product User Needs Document",
  "Protocol or plan",
  "Quality Manual",
  "Quality Plan",
  "Quality Specification",
  "Receiving Record Form",
  "Report",
  "Requirements Document",
  "Risk Management Documents",
  "Risk Management Records",
  "Standard Operating Procedure",
  "Supplier Forms",
  "Supply Item",
  "Training Curriculum",
  "Work Instruction",
  "Document Approval Matrix",
  "PO Approval Matrix",
  "eForm"];

export const DOCUMENT_TABLE_LIST_NAMES = [
  "Clinical Document",
  "Clinical Protocol",
  "Clinical Report",
  "Indications for Use",
  "Product User Needs Document",
  "Requirements Document",
  "Design Document",
  "Design and Development Records",
  "Risk Management Documents",
  "Risk Management Records",
  "Method",
  "Protocol or plan",
  "Report",
  "Device Master Record",
  "Labeling",
  "Manufacturing Process Instruction",
  "Quality Specification",
  "Form",
  "Receiving Record Form",
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
  "Legal Form",
  "Business Document",
  "Business Form",
  "Legal Document",
  "Supplier Forms",
];
