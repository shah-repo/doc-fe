import { Attachment } from "../attachments";
import { ChangeRequest } from "../changeRequest";
import { User } from "../common";
import {
  DOCUMENT_REVISION_AUDIT_SET,
  DOCUMENT_REVISION_LIST,
  DOCUMENT_REVISION_SET,
  DOCUMENT_SET,
} from "./constants";

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

export enum RevisionChangeType {
  NextRevision = "NEXT_REVISION",
  NextRevisionStage = "NEXT_REVISION_STAGE",
  Obsolete = "OBSOLETE",
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
  type: DocumentRevisionType;
  released: Date;
  referenceTo: Reference[];
  referencedBy: Reference[];
  createdAt?: string;
  changeRequest?: ChangeRequest;
}

export enum DocumentRevisionType {
  SOP = "SOP",
  MI = "MI",
  ADM = "ADM",
  CS = "CS",
  CP = "CP",
  EHS = "EHS",
  FG = "FG",
  FRM = "FRM",
  GD = "GD",
  CR = "CR",
  DD = "DD",
  DMR = "DMR",
  ES = "ES",
  FM = "FM",
  LBL = "LBL",
  MKT = "MKT",
  MPI = "MPI",
  MVP = "MVP",
  QM = "QM",
  QP = "QP",
  QS = "QS",
  REF = "REF",
  RPT = "RPT",
  RM = "RM",
  SA = "SA",
  SI = "SI",
  TC = "TC",
  TL = "TL",
  TM = "TM",
  TP = "TP",
  TR = "TR",
  WI = "WI",
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
  document?: Partial<DocumentRevisionDocument>;
  revisionChangeType?: RevisionChangeType;
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
