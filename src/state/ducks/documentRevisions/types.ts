import { TableColumnActionType } from "../../../ui/components/table/column/types";
import { FBDocumentFlowProps } from "../../../ui/form.builder/types/formik";
import { Attachment } from "../attachments";
import { AuditActionPayload } from "../audit/types";
import { ChangeRequest } from "../changeRequest";
import { Owner } from "../common";
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
  documentType: Partial<DocumentType>;
  referencedBy: DocumentRevision[];
}

export interface Document {
  id: string;
  docId: string;
  documentType: DocumentType;
  documentRevisions: DocumentRevision[];
}

export interface Reference {
  id: string;
  name: string;
  docId?: string;
  documentRevisions?: DocumentRevision[];
  document: DocumentRevisionDocument;
}

export interface DocumentRevision extends FBDocumentFlowProps {
  id: string;
  docId?: string;
  typePrefix?: string;
  version: number;
  revision: number;
  revisionStage: number;
  revisionChangeType: RevisionChangeType;
  name: string;
  description: string;
  owner: Owner;
  attachments: Attachment[];
  status: DocumentRevisionStatus;
  document: DocumentRevisionDocument;
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

export const RevisionStageOptions = [
  { value: 1, text: "common.Numeric" },
  { value: 2, text: "common.AlphaNumeric" },
  { value: 3, text: "common.Alpha" },
];

export interface ReferenceToEditRequest {
  id: string;
}

export interface DocumentRevisionEditRequestBody extends FBDocumentFlowProps {
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
