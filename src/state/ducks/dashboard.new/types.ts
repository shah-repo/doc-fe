import { RECENTS_LIST, RECENTS_REMOVE } from "./constants";

export enum RecentDocType {
  PO = "PO",
  MPI = "MPI",
  FORM = "FORM",
  DAM = "DAM",
  SUPPLIER = "SUPPLIER",
  CHANGE_REQUEST = "CHANGE_REQUEST",
  APPROVAL_REQUEST = "Approval Request",
  PURCHASE_ORDER = "Purchase Order",
}

export interface RecentItems {
  accessedAt: string;
  itemType: string;
  itemId: string;
  docId: string;
  docTitle: string;
  docType: RecentDocType;
  docRevId?: string;
}

export interface RecentsListAction {
  type: typeof RECENTS_LIST;
  payload: RecentItems[];
}

export interface RecentsRemoveAction {
  type: typeof RECENTS_REMOVE;
  payload: number;
}

export type RecentsState = RecentItems[];
