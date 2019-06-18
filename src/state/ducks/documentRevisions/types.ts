import { Attachment } from "../attachments";
import { DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET, DOCUMENT_SET } from "./constants";

export enum DocumentRevisionStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Withdrawn = "WITHDRAWN",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export interface DocumentRevisionDocument {
  id: string;
  typeCount: number;
}
export interface Document {
  id: string;
  typeCount: number;
  documentRevisions: DocumentRevision[];
}

export interface DocumentRevision {
  id: string;
  revision: string;
  name: string;
  description: string;
  owner: any;
  attachments: Attachment[];
  status: DocumentRevisionStatus;
  document: DocumentRevisionDocument;
  type: string;
  released: Date;
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

export type DocumentRevisionsAllIdsState = string[];
