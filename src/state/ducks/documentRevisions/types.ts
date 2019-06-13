import { Attachment } from "../attachments";
import { DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET } from "./constants";

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

export type DocumentRevisionsAllIdsState = string[];
