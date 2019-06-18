import { Attachment } from "../attachments";
import { DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET, DOCUMENT_SET } from "./constants";

export enum DocumentRevisionStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Withdrawn = "WITHDRAWN",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Released = "RELEASED",
  Deprecated = "DEPRECATED",
  Obsolete = "OBSOLETE",
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

export interface Reference {
  id: string;
  name: string;
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

export type DocumentRevisionsAllIdsState = string[];
