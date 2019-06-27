import { Attachment } from "../attachments";
import { DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET, DOCUMENT_SET, DOCUMENT_REVISION_AUDIT_SET } from "./constants";
import { User, Approval } from "../common";

export enum DocumentRevisionStatus {
  Draft = "DRAFT",
  PendingChange = "PENDING_CHANGE",
  PendingSubmission = "PENDING_SUBMISSION",
  Submitted = "SUBMITTED",
  InReview = "IN_REVIEW",
  Withdrawn = "WITHDRAWN",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Released = "RELEASED",
  Deprecated = "DEPRECATED",
  Obsolete = "OBSOLETE",
  Implementation = "IMPLEMENTATION",
}

export interface DocumentRevisionDocument {
  id: string;
  ordinalNumber: number;
}
export interface Document {
  id: string;
  ordinalNumber: number;
  documentRevisions: DocumentRevision[];
}

export interface Reference {
  id: string;
  name: string;
}

export interface DocumentRevision {
  id: string;
  docId?: string;
  version: number;
  revision: string;
  name: string;
  description: string;
  owner: User;
  attachments: Attachment[];
  status: DocumentRevisionStatus;
  document: DocumentRevisionDocument;
  type: string;
  released: Date;
  referenceTo: Reference[];
  referencedBy: Reference[];
}

export interface ReferenceToEditRequest {
  id: string;
}

export interface DocumentRevisionEditRequestBody {
  name: string;
  description: string;
  attachments: Attachment[];
  type?: string;
  referenceTo: ReferenceToEditRequest[];
}

export interface DocumentRevisionSetAction {
  type: typeof DOCUMENT_REVISION_SET;
  payload: DocumentRevision;
}

export interface DocumentSetAction {
  type: typeof DOCUMENT_SET;
  payload: Document;
}

export interface DocumentRevisionsListAction {
  type: typeof DOCUMENT_REVISION_LIST;
  payload: DocumentRevision[];
}

export interface DocumentRevisionsByIdState {
  [key: string]: DocumentRevision;
}

export interface DocumentByIdState {
  [key: string]: Document;
}
export interface DocumentRevisionProps {
  documentRevision: DocumentRevision;
}

export interface DocumentRevisionsProps {
  documentRevisions: DocumentRevision[];
}

export type DocumentRevisionsAllIdsState = string[];

export type DocumentRevisionTransition = "pending_submission";

export interface DocumentRevisionTransitionRequestBody {
  password: string;
}

export interface DocumentRevisionTransitionResponse {
  id: string;
}

export interface Audit {
  field: string;
  type: string;
  nextValue: string | Attachment;
  timestamp: string;
  groupId: string;
  owner: User;
}

export interface AuditActionPayload {
  id: string;
  audit: Audit[];
}

export interface DocumentRevisionAuditSetAction {
  type: typeof DOCUMENT_REVISION_AUDIT_SET;
  payload: AuditActionPayload;
}

export interface AuditByCRIdState {
  [key: string]: Audit[];
}

export type AllIdsState = string[];