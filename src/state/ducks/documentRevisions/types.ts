import { TableColumnActionType } from "../../../ui/components/table/column/types";
import { Attachment } from "../attachments";
import { AuditActionPayload } from "../audit/types";
import { ChangeRequest } from "../changeRequest";
import { User } from "../common";
import { TrainingRecord } from "../training";
import {
  DOCUMENT_REVISION_AUDIT_SET,
  DOCUMENT_REVISION_LIST,
  DOCUMENT_REVISION_SET,
  DOCUMENT_SET,
} from "./constants";
import { DocumentType } from "./documentType";

export enum DocumentRevisionStatus {
  Draft = "DRAFT",
  PendingChange = "PENDING_CHANGE",
  InReview = "IN_REVIEW",
  Released = "RELEASED",
  Deprecated = "DEPRECATED",
  Obsolete = "OBSOLETE",
}

export enum RevisionChangeType {
  NextRevision = "NEXT_REVISION",
  NextRevisionStage = "NEXT_REVISION_STAGE",
  Obsolete = "OBSOLETE",
}

export interface DocumentRevisionDocument {
  id: string;
  docId: string;
  documentType: string;
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
  docId?: string;
  documentRevisions?: DocumentRevision[];
  document: DocumentRevisionDocument;
}

export interface DocumentRevision {
  id: string;
  docId?: string;
  typePrefix?: string;
  version: number;
  revision: number;
  revisionStage: number;
  name: string;
  description: string;
  owner: User;
  attachments: Attachment[];
  status: DocumentRevisionStatus;
  document: DocumentRevisionDocument;
  documentType: DocumentType;
  released: Date;
  referenceTo: Reference[];
  createdAt?: string;
  changeRequest?: ChangeRequest;
  actions?: TableColumnActionType[];
  deprecatedAt?: string;
  obsoletedAt?: string;
  releasedAt?: string;
  trainingRecords: TrainingRecord[];
  retrain?: boolean;
}

// TODO: check if this is still needed
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
  ESL = "Equipment Specifications Lot",
  TLL = "Tooling Lot",
  CSL = "Component Specifications Lot",
  EB = "Engineering Build",
}

export const RevisionStageOptions = [
  { value: 1, text: "common.Numeric" },
  { value: 2, text: "common.AlphaNumeric" },
  { value: 3, text: "common.Alpha" },
];

export interface ReferenceToEditRequest {
  id: string;
}

export interface DocumentRevisionEditRequestBody {
  name: string;
  docId?: string;
  description: string;
  attachments: Attachment[];
  type?: string;
  referenceTo: ReferenceToEditRequest[];
  document?: Partial<DocumentRevisionDocument>;
  revisionChangeType?: RevisionChangeType;
  revisionStage?: number;
  retrain?: boolean;
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

export interface DocumentRevisionAuditSetAction {
  type: typeof DOCUMENT_REVISION_AUDIT_SET;
  payload: AuditActionPayload;
}

export type AllIdsState = string[];
