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
  docId: string;
  type: string;
  referencedBy: DocumentRevision[];
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
  createdAt?: string;
  changeRequest?: ChangeRequest;
}

export enum DocumentRevisionType {
  SOP = "Standard Operating Procedure",
  ADM = "Administrative",
  CS = "Component Specifications",
  CP = "Clinical Protocol",
  EHS = "Environmental Health & Safety",
  FG = "Finished Good",
  GD = "General Document",
  CR = "Clinical Report",
  DD = "Design Document",
  DMR = "Device Master Record",
  ES = "Equipment Specifications",
  FM = "Form",
  LBL = "Labeling",
  MKT = "Marketing",
  MPI = "Manufacturing Process Instructions",
  MVP = "Master Validation Plan",
  QM = "Quality Manual",
  QP = "Quality Plan",
  QS = "Quality Specifications",
  REF = "Model/Catalog Number",
  RPT = "Report",
  RM = "Risk Management",
  SA = "Subassembly",
  SI = "Supply Item",
  TC = "Training Curriculum",
  TL = "Tooling",
  TM = "Test Method",
  TP = "Test Protocol",
  TR = "Test Report",
  WI = "Work Instructions",
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
