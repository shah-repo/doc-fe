import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { TableColumnActionType } from "../../../ui/components/table/column/types";
import { FBSchemaProps, FBTaskItem } from "../../../ui/form.builder";
import { Attachment } from "../attachments";
import { AuditActionPayload } from "../audit/types";
import { Group } from "../auth/types";
import { ChangeRequest } from "../changeRequest";
import { Approval, Id, Owner, User } from "../common";
import { TrainingRecord } from "../training";
import { DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET, DOCUMENT_SET } from "./constants";
import { DocumentGroupOptionsType, DocumentType } from "./documentType";

export enum DocumentRevisionStatus {
  Draft = "DRAFT",
  PendingChange = "PENDING_CHANGE",
  InReview = "IN_REVIEW",
  Released = "RELEASED",
  Approved = "APPROVED",
  Deprecated = "DEPRECATED",
  Obsolete = "OBSOLETE",
  Canceled = "CANCELED",
  Voided = "VOIDED",
}

export enum DocumentRevisionStatusAlias {
  Draft = "WIP",
}

export enum RevisionChangeType {
  NextRevision = "NEXT_REVISION",
  NextRevisionStage = "NEXT_REVISION_STAGE",
  Obsolete = "OBSOLETE",
  AdministrativeChange = "ADMINISTRATIVE_CHANGE",
  Void = "VOID",
}

export interface DocumentRevisionDocument {
  id: string;
  docId: string;
  documentType: Partial<DocumentType>;
  referencedBy: DocumentRevision[];
  canAccess: boolean;
  securityList: SecurityList;
}

export interface SecurityList {
  securityGroups: Group[];
  securityEmployees: User[];
  operators: User[];
}

export interface Document {
  id: string;
  docId: string;
  documentType: DocumentType;
  documentRevisions: DocumentRevision[];
  securityList: SecurityList;
}

export interface Reference {
  id: string;
  name: string;
  docId?: string;
  documentRevisions?: DocumentRevision[];
  document: DocumentRevisionDocument;
}

export interface PDF {
  createdAt: string;
  updatedAt: string;
  id: string;
  s3Url: string;
  name: string;
  type: string;
}

export interface Precalc {
  formDocId: string;
  revision: number;
}

export interface DocumentRevision extends FBDocumentRevisionProps {
  precalc: Precalc;
  id: string;
  docId?: string;
  typePrefix?: string;
  version: number;
  revision: number;
  subRevision?: number;
  revisionStage: number;
  revisionChangeType: RevisionChangeType;
  name: string;
  description: string;
  displayRevision: string;
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
  effectiveDate?: Date;
  retrain?: boolean;
  grantAccess?: boolean;
  renderHTML?: string;
  pdf?: PDF;
  outputRevision?: boolean;
  primaryAttachment?: Attachment;
  approvals?: Approval[];
  updatedAt?: string;
  schema?: FBSchemaProps[];
}

export const RevisionStageOptions = [
  { value: 1, text: "common.Numeric" },
  { value: 2, text: "common.NumericAlpha" },
  { value: 3, text: "common.Alpha" },
];

export interface ReferenceToEditRequest {
  id: string;
}

export interface SecurityListRequest {
  securityEmployees: Id[];
  securityGroups: Id[];
  operators: Id[];
}

export interface DocumentRevisionDocumentRequest {
  docId?: string;
  id?: string;
  documentType?: Partial<DocumentType>;
  securityList: SecurityListRequest;
}

export interface DocumentRevisionEditRequestBody extends FBDocumentRevisionProps {
  name: string;
  docId?: string;
  description: string;
  attachments: Attachment[];
  type?: string;
  referenceTo: ReferenceToEditRequest[];
  document?: Partial<DocumentRevisionDocumentRequest>;
  revisionChangeType?: RevisionChangeType;
  revisionStage?: number;
  retrain?: boolean;
  renderHTML?: string;
  status?: DocumentRevisionStatus;
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

export interface ApproveAndReleaseRequest {
  approvers: Id[];
  effectiveDate?: string;
  documentType: Id;
  formDocument: Id;
}

export interface CreateAndReleaseRequest {
  releasedDocumentRevision: DocumentRevision;
  releaseDto: CreateAndReleaseRequest;
}

export interface FBFormTemplateProps {
  outputDocumentTypes: FBOutputDocumentType[] | OptionType[];
  schema: FBSchemaProps[];
  helloSignTemplateId?: string;
}

export interface FBDocumentRevisionProps {
  id?: string;
  formTemplate?: FBFormTemplateProps;
  formDocument?: FBDocumentRevisionProps;
  formInput?: Record<string, any>;
  document?: Partial<DocumentRevisionDocumentRequest>;
  revision?: number;
  subRevision?: number;
  revisionStage?: number;
  revisionChangeType?: RevisionChangeType;
  releasedAt?: string;
  renderHTML?: string;
  status?: DocumentRevisionStatus;
  tasks?: FBTaskItem[];
}

export interface FBOutputDocumentType {
  id: string;
  documentTypeName?: string;
  groupOptions?: DocumentGroupOptionsType;
}

export interface HeaderTableType {
  label: string;
  key: string;
}


