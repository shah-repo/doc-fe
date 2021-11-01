import { RECENTS_LIST } from "./constants";

export enum RecentType {
  DOCUMENT = "DOCUMENT",
  CHANGE_REQUEST = "CHANGE_REQUEST",
}

export enum RecentDocType {
  APPROVAL_REQUEST = "Approval Request",
  PURCHASE_ORDER = "Purchase Order",
  FORM = "Form",
  SUPPLIERS = "Suppliers",
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

export type RecentsState = RecentItems[];
