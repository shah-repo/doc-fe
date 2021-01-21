import { TableColumnActionType } from "../../../ui/components/table/column/types";
import { Attachment } from "../attachments";
import { Owner } from "../common";
import { DOCUMENT_PROPOSED_DOC_ID_SET, DOCUMENT_SET, DOCUMENTS_LIST, DOCUMENTS_TO_REVIEW_LIST } from "./constants";


export enum DocumentStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Withdrawn = "WITHDRAWN",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Released = "RELEASED"
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
  owner: Owner;
  approvals: Approval[];
  attachments: Attachment[];
  actions: TableColumnActionType[];
  docId: string;
}

export interface DocumentProposedId {
  docId?: string;
}

export interface DocumentProposedIdSetAction {
  type: typeof DOCUMENT_PROPOSED_DOC_ID_SET;
  payload: string;
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

export type DocumentTransition = "approve" | "reject" | "to_review" | "withdraw";

export interface DocumentTransitionRequestBody {
  password: string;
}

export interface DocumentTransitionResponse {
  id: string;
}

export interface AccessRequestBody {
  employee: DocumentTransitionResponse;
}
