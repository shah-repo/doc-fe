import { RECENTS_LIST } from "./constants";

export enum RecentTypes {
  DOCUMENT = "DOCUMENT",
  CHANGE_REQUEST = "CHANGE_REQUEST",
}

export enum RecentDocTypeGroups {
  FORM = "FORM",
  OTHER = "OTHER",
  PI = "PI",
  RECORD = "RECORD",
  CHANGE_REQUEST = "CHANGE_REQUEST",
  DAM = "DAM",
  DYNAMIC_FORM = "DYNAMIC_FORM",
  POAM = "POAM",
  PO = "PO",
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
  NEW_COMPANY = "NEW_COMPANY",
  SEED_DOCUMENT = "SEED_DOCUMENT",
  LHR = "LHR",
  PI_INSTANCE = "PI_INSTANCE",
  TRAINING_CURRICULUM = "TRAINING_CURRICULUM",
  BULK_CREATE = "BULK_CREATE",
}

export interface RecentItems {
  accessedAt: string;
  itemType: string;
  itemId: string;
  docId: string;
  docTitle: string;
  docTypeGroup: RecentDocTypeGroups;
  docRevId?: string;
}

export interface RecentsListAction {
  type: typeof RECENTS_LIST;
  payload: RecentItems[];
}

export type RecentsState = RecentItems[];
