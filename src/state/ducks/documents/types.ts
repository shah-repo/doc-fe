import { Attachment } from "../attachments";
import { DOCUMENT_SET, DOCUMENTS_LIST, DOCUMENTS_TO_REVIEW_LIST } from "./constants";

export enum DocumentStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Withdrawn = "CLOSED",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export enum ApprovalStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export interface User {
  id: string;
  email: string;
}

export interface Approval {
  id: string;
  status: ApprovalStatus;
  approver: User;
  reviewedAt?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  owner: User;
  approvals: Approval[];
  attachments: Attachment[];
}

export interface DocumentEditRequestBody {
  name: string;
  type: string;
  attachmentIds: string[];
  approversEmails: string[];
}

export interface DocumentListAction {
  type: typeof DOCUMENTS_LIST;
  payload: Document[];
}

export interface DocumentsToReviewListAction {
  type: typeof DOCUMENTS_TO_REVIEW_LIST;
  payload: Document[];
}

export interface DocumentSetAction {
  type: typeof DOCUMENT_SET;
  payload: Document;
}

export interface DocumentsByIdState {
  [key: string]: Document;
}

export type DocumentsAllIdsState = string[];
export type DocumentsReviewIdsState = string[];
