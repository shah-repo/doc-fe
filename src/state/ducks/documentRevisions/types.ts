import { Attachment } from "../attachments";
import { DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET } from "./constants";

export enum DocumentRevisionStatus {
  Draft = "DRAFT",
  PendingChange = "PENDING_CHANGE",
  PendingSubmission = "PENDING_SUBMISSION",
  Submitted = "SUBMITTED",
  InReview = "IN_REVIEW",
  Implementation = "IMPLEMENTATION",
  Released = "RELEASED",
  Deprecated = "DEPRECATED",
  Obsolete = "OBSOLETE",
}

export interface DocumentRevisionDocument {
  id: string;
  typeCount: number;
}

export interface DocumentRevision {
  id: string;
  docId?: string;
  version: number;
  revision: string;
  name: string;
  description: string;
  owner: any;
  attachments: Attachment[];
  status: DocumentRevisionStatus;
  document: DocumentRevisionDocument;
  type: string;
}

export interface DocumentRevisionEditRequestBody {
  name: string;
  description: string;
  attachments: Attachment[];
  type?: string;
}

export interface DocumentRevisionSetAction {
  type: typeof DOCUMENT_REVISION_SET;
  payload: DocumentRevision;
}

export interface DocumentRevisionsListAction {
  type: typeof DOCUMENT_REVISION_LIST;
  payload: DocumentRevision[];
}

export interface DocumentRevisionsByIdState {
  [key: string]: DocumentRevision;
}

export interface DocumentRevisionProps {
  documentRevision: DocumentRevision;
}

export interface DocumentRevisionsProps {
  documentRevisions: DocumentRevision[];
}

export type DocumentRevisionsAllIdsState = string[];
