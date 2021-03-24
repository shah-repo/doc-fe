import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { TableColumnActionType } from "../../../ui/components/table/column/types";
import { FBNoteItem, FBSchemaProps, FBTaskItem } from "../../../ui/form.builder";
import { Attachment } from "../attachments/types";
import { AuditActionPayload } from "../audit/types";
import { Group } from "../auth/types";
import { ChangeRequest } from "../changeRequest/types";
import { Approval, Id, Nullable, Owner, User } from "../common/types";
import { TrainingRecord } from "../training/types";
import { DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET, DOCUMENT_SET } from "./constants";
import { DocumentGroupOptionsType, DocumentType } from "./documentType/types";

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


export enum RevisionChangeType {
  NextRevision = "NEXT_REVISION",
  NextRevisionStage = "NEXT_REVISION_STAGE",
  Obsolete = "OBSOLETE",
  AdministrativeChange = "ADMINISTRATIVE_CHANGE",
  Void = "VOID",
}

export interface DocumentRevisionDocument {
  children: DocumentRevision[];
  parent: DocumentRevision;
  id: string;
  docId: string;
  documentType: Partial<DocumentType>;
  referencedBy: DocumentRevision[];
  canAccess: boolean;
  securityList: SecurityList;
  lot?: {
    lotId: string;
  };
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

interface Precalc {
  formDocId: string;
  revision: number;
}

export interface DocumentRevision extends FBDocumentRevisionProps {
  displayStatus: DocumentRevisionStatus;
  children?: DocumentRevision[];
  parent?: DocumentRevision;
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
  parentParts?: DocumentRevision[];
  parentEquipment?: Id;
  equipmentSection?: string;
  // there can currently be only one child part
  childrenParts?: DocumentRevision[];
  outputDocumentTypes?: any;
  inputOwners?: InputOwner[];
  documentId?: string;
  smartReferencesFrom?: SmartReference[];
  smartReferencesTo?: SmartReference[];
}

interface SmartReference {
  fromDocRev?: Nullable<DocumentRevision>;
  fromDocRevId?: Nullable<string>;
  fromDocumentId?: Nullable<string>;
  id: string;
  metadata: {
    fieldId: string;
  };
  toDocRevId?: Nullable<string>;
  toDocRev?: Nullable<DocumentRevision>;
  toDocumentId?: Nullable<string>;
  type: SmartReferenceType;
}

export enum SmartReferenceType {
  HiddenPiInstance = "HIDDEN_PI_INSTANCE",
  General = "GENERAL",
  EquipmentReplacement = "EQUIPMENT_REPLACEMENT",
  LotUsage = "LOT_USAGE",
}

interface InputOwner {
  [key: string]: string;
}


export const RevisionStageOptions = [
  { value: 1, text: "common.Numeric" },
  { value: 2, text: "common.NumericAlpha" },
  { value: 3, text: "common.Alpha" },
];

export interface ReferenceToEditRequest {
  id: string;
}

interface SecurityListRequest {
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
  parentEquipment?: Id;
  equipmentSection?: string;
}

export interface DocumentRevisionSetAction {
  type: typeof DOCUMENT_REVISION_SET;
  payload?: {
    documentRevision?: DocumentRevision;
    requestBody?: any;
    docRevId?: string;
  };
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

export interface FinalizeAndReleaseRequest {
  approvers: Id[];
  effectiveDate?: string;
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
  revisionStage?: string | number;
  revisionChangeType?: RevisionChangeType;
  releasedAt?: string;
  renderHTML?: string;
  status?: DocumentRevisionStatus;
  tasks?: FBTaskItem[];
  notes?: FBNoteItem[];
}

export interface FBOutputDocumentType {
  id: string;
  documentTypeName?: string;
  groupOptions?: DocumentGroupOptionsType[];
}

export interface HeaderTableType {
  label: string;
  key: string;
}


