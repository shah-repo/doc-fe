import { Attachment } from "../attachments/types";
import { ChangeRequest } from "../changeRequest/types";
import { Approval } from "../common/types";
import { DocumentRevision } from "../documentRevisions/types";
import { TrainingRecord } from "../training/types";
import { RECENTS_LIST, RECENTS_REMOVE } from "./constants";

export enum RecentType {
  PENDING_REVIEW = "PENDING_REVIEW",
  PENDING_DOC_CONTROL = "PENDING_DOC_CONTROL",
  PENDING_TASK = "PENDING_TASK",
  PENDING_TRAINING_RECORDS = "PENDING_TRAINING_RECORDS",
  PURCHASE_ORDERS = "PURCHASE_ORDERS",
  APPROVED_APPROVAL_REQUESTS = "APPROVED_APPROVAL_REQUESTS",
  DOCUMENT = "DOCUMENT",
  CHANGE_REQUEST = "CHANGE_REQUEST",
}

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
  revisionId?: string | undefined;
}

export interface Recent {
  itemType: RecentType;
  type: RecentType;
  userId: string;
  changeReq?: ChangeRequest;
  document?: DocumentRevision;
  trainingRecord?: TrainingRecord;
  documentRevision?: DocumentRevision;
  docRev?: DocumentRevision;
  approval?: Approval;
  docRevAttachments?: Attachment[];
}

export interface RecentsListAction {
  type: typeof RECENTS_LIST;
  payload: Recent[];
}

export interface RecentsRemoveAction {
  type: typeof RECENTS_REMOVE;
  payload: number;
}

export type RecentsState = Recent[];
