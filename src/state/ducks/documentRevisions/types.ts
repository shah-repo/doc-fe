import { OptionType } from '../../../ui/components/forms/fields/Autocomplete/types';
import { TableColumnActionType } from '../../../ui/components/table/column/types';
import { FBNoteItem, FBSchemaProps, FBTaskItem } from '../../../ui/form.builder';
import { Attachment } from '../attachments/types';
import { AuditActionPayload } from '../audit/types';
import { Group } from '../auth/types';
import { ChangeRequest } from '../changeRequest/types';
import { Approval, Id, Nullable, Owner, ReleasedBy, User } from '../common/types';
import { Employee } from '../company/types';
import { RELATED_PARTS_STATUS } from '../relatedParts/types';
import { TrainingRecord } from '../training/types';
import { DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_SET, DOCUMENT_SET } from './constants';
import { DocumentGroupOptionsType, DocumentGroupType, DocumentType } from './documentType/types';

export enum DocumentRevisionStatus {
  Draft = 'DRAFT',
  PendingChange = 'PENDING_CHANGE',
  InReview = 'IN_REVIEW',
  Released = 'RELEASED',
  Approved = 'APPROVED',
  Deprecated = 'DEPRECATED',
  Obsolete = 'OBSOLETE',
  Canceled = 'CANCELED',
  Voided = 'VOIDED',
}

export enum DocumentRevisionStatusDisplay {
  Draft = 'Draft',
  PendingChange = 'PendingChange',
  InReview = 'InReview',
  Released = 'Released',
  Approved = 'Approved',
  Deprecated = 'Deprecated',
  Obsolete = 'Obsolete',
  Canceled = 'Canceled',
  Voided = 'Voided',
}

export enum POStatusType {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
  VOIDED = 'VOIDED',
}

export enum EquipmentStatus {
  Active = 'Active',
  ActiveCalibrated = 'Active Calibrated',
  ActiveNoCalRequired = 'Active No Cal Required',
  Inactive = 'Inactive',
  OutForCalibration = 'Out for Calibration',
  OutForMaintenance = 'Out for Maintenance',
  Retired = 'Retired',
  UnplannedDowntime = 'Unplanned Downtime',
  Voided = 'Voided',
}

export const ACTIVE_EQUIPMENT_STATUSES = [
  EquipmentStatus.Active,
  EquipmentStatus.ActiveCalibrated,
  EquipmentStatus.ActiveNoCalRequired,
];

// Lot types implemetation
export enum LotStatus {
  QUARANTINE = 'QUARANTINE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  USE_AS_IS = 'USE_AS_IS',
  RTV = 'RETURN_TO_VENDOR',
  REWORK = 'REWORK',
  SCRAP = 'SCRAP',
  RD_USED_ONLY = 'R&D_USED_ONLY',
  OTHER = 'OTHER',
  VOIDED = 'VOIDED',
}

export enum POStatusLabelMapping {
  OPENED = 'Open',
  CLOSED = 'Closed',
  VOIDED = 'Voided',
}
export enum DocumentCategory {
  PurchaseOrder = 'Purchase Order',
  Supplier = 'Supplier',
  Equipment = 'Equipment',
  TrainingCurriculums = 'Training Curriculums',
  Lot = 'Lot',
  Parts = 'Parts',
  EB = 'EB',
}
export enum RevisionChangeType {
  NextRevision = 'NEXT_REVISION',
  NextRevisionStage = 'NEXT_REVISION_STAGE',
  Obsolete = 'OBSOLETE',
  AdministrativeChange = 'ADMINISTRATIVE_CHANGE',
  Void = 'VOID',
}

export interface DocumentRevisionDocument {
  children: DocumentRevision[]
  parent: DocumentRevision
  id: string
  docId: string
  documentType: Partial<DocumentType>
  referencedBy: DocumentRevision[]
  canAccess: boolean
  securityList: SecurityList
  lot?: {
    lotId: string
  }
  smartReferencesTo?: SmartReference[]
  smartReferencesFrom?: SmartReference[]
  typeSpecificConfig?: TypeSpecificConfig
  operators?: Employee[]
}

export interface SecurityList {
  securityGroups: Group[]
  securityEmployees: User[]
  operators: User[]
}

export interface Document {
  id: string
  docId: string
  documentType: DocumentType
  documentRevisions: DocumentRevision[]
  securityList: SecurityList
}

export interface Reference {
  id: string
  name: string
  docId?: string
  documentRevisions?: DocumentRevision[]
  document: DocumentRevisionDocument
}

export interface PDF {
  createdAt: string
  updatedAt: string
  id: string
  s3Url: string
  name: string
  type: string
}

interface LHR{
  docRevId: string
  documentId: string
  label: string
}

interface LOT{
  label: string
}

interface Part{
  docRevId: string
  documentId: string
  label: string
}

export interface RelatedParentPartDetails {
  parentDocId: string
  documentId: string
  docRevId: string
}

export interface ChangeControlOptions {
  docId: string
  id: string
  name: string
  status: DocumentRevisionStatus
  version: number
  displayRevision: string
  releasedAt: string
  formInput: Record<string, any>
  schemaMap: {[key: string]: string}
}

export interface IAssociatedChangeRequest {
  crId: string
  revChanges: string
  title?: string
  owner: string
  state: string
  updatedAt: string
}

export interface LSHS {
  lhr: LHR
  lot: LOT
  part: Part
}

export interface Precalc {
  formDocId: string
  revision: number
  po_amount?: string
  po_amount_with_currency?: string
  cali_due_date?: string
  pm_due_date?: string
  lshs_subtitle?: LSHS
  lot_on_hand_quantity?: string
  lot_part?: string
  lot_part_revision?: string
  related_equipment?: string[]
}

interface DocumentsInLHRS {
  displayRevision: string
  displayStatus: DocumentRevisionStatus
  docId?: string
  docRevId?: string
  docRevTitle?: string
  documentId?: string
  isExpired?: boolean
}

export interface UsedDocumentsInLHRS {
  [key: string]: DocumentsInLHRS
}

export interface DocumentRevision extends FBDocumentRevisionProps {
  displayStatus: DocumentRevisionStatus
  children?: DocumentRevision[]
  parent?: DocumentRevision
  precalc: Precalc
  id: string
  docId?: string
  typePrefix?: string
  version: number
  revision: number
  subRevision?: number
  revisionStage: number
  revisionChangeType: RevisionChangeType
  name: string
  description: string
  displayRevision: string
  owner: Owner
  attachments: Attachment[]
  status: DocumentRevisionStatus
  document: DocumentRevisionDocument
  released: Date
  referenceTo: Reference[]
  createdAt?: string
  changeRequest?: ChangeRequest
  actions?: TableColumnActionType[]
  deprecatedAt?: string
  obsoletedAt?: string
  releasedAt?: string
  releasedBy?: ReleasedBy
  voidedAt?: string
  trainingRecords: TrainingRecord[]
  effectiveDate?: Date
  retrain?: boolean
  grantAccess?: boolean
  renderHTML?: string
  renderHTMLDefined?: boolean
  pdf?: PDF
  outputRevision?: boolean
  primaryAttachment?: Attachment
  approvals?: Approval[]
  updatedAt?: string
  schema?: FBSchemaProps[]
  parentParts?: DocumentRevision[]
  parentEquipment?: Id
  equipmentSection?: string
  // there can currently be only one child part
  childrenParts?: DocumentRevision[]
  outputDocumentTypes?: any
  inputOwners?: InputOwner[]
  documentId?: string
  smartReferencesFrom?: SmartReference[]
  smartReferencesTo?: SmartReference[]
  usedDocumentsInLHRS?: UsedDocumentsInLHRS[]
  redline?: boolean
  poStatus?: POStatusType
  relatedPartsStatus?: RELATED_PARTS_STATUS
  previousRevRelatedPartsStatus?: RELATED_PARTS_STATUS
  relatedParentPartDetails?: RelatedParentPartDetails
  changeControlOptions?: ChangeControlOptions
  isBeingEditedAfterRelease?: boolean
  lotStatus?: LotStatus
  hasAttachments?: boolean
  hasPrimaryAttachment?: boolean
  needSync?: boolean
  needSyncedSuccessNotify?: boolean
  eqStatus?: EquipmentStatus
  lifecyclePhaseId?: string
  lifecyclePhase?: string
  isExpired?: boolean
  expiryDate?: string
}

interface EQ {
  docId: string
  docRevId: string
  nextCalibration: string
  nextPm: string
  title: string
}

interface Material {
  docId: string
  docRevId: string
  quantity?: string
  revision: string
  title: string
  unit: string
}

export interface MeqResponse {
  equipment: EQ[]
  materials: Material[]
}

export interface SmartReference {
  fromDocRev?: Nullable<DocumentRevision>
  fromDocRevId?: Nullable<string>
  fromDocumentId?: Nullable<string>
  fromDocument?: Nullable<DocumentRevision>
  id: string
  metadata: {
    fieldId: string
    lotDocId?: string
    startedBy: string
    completedBy: string
    materialId?: string
    equipmentId?: string
    quantity?: number
    unit?: string
    lotPart?: string
    lhr?: LSHS
  }
  toDocRevId?: Nullable<string>
  toDocRev?: Nullable<DocumentRevision>
  toDocumentId?: Nullable<string>
  type: SmartReferenceType
  active?: boolean
  stepIndex?: Nullable<number>
}

export enum SmartReferenceType {
  HiddenPiInstance = 'HIDDEN_PI_INSTANCE',
  General = 'GENERAL',
  EquipmentReplacement = 'EQUIPMENT_REPLACEMENT',
  LotUsage = 'LOT_USAGE',
  LotSoruce = 'LOT_SOURCE',
}

export interface InputOwner {
  [key: string]: string
}

export const RevisionStageOptions = [
  { value: 1, text: 'common.Numeric' },
  { value: 2, text: 'common.NumericAlpha' },
  { value: 3, text: 'common.Alpha' },
];

export interface ReferenceToEditRequest {
  id: string
}

export interface SecurityListRequest {
  securityEmployees: Id[]
  securityGroups: Id[]
  operators: Id[]
}

export interface DocumentRevisionDocumentRequest {
  docId?: string
  id?: string
  documentType?: Partial<DocumentType>
  securityList: SecurityListRequest
}

export interface ExportToEmailRequest {
  includeAuditLogs: boolean
}

export interface DocumentRevisionEditRequestBody extends FBDocumentRevisionProps {
  name: string
  docId?: string
  description: string
  lifecyclePhaseId?: string
  attachments: Attachment[]
  type?: string
  referenceTo: ReferenceToEditRequest[]
  document?: Partial<DocumentRevisionDocumentRequest>
  revisionChangeType?: RevisionChangeType
  revisionStage?: number
  retrain?: boolean
  renderHTML?: string
  status?: DocumentRevisionStatus
  parentEquipment?: Id
  equipmentSection?: string
  redline?: boolean
  tabId?: string
}

export interface DocumentRevisionSetAction {
  type: typeof DOCUMENT_REVISION_SET
  payload?: {
    documentRevision?: DocumentRevision
    requestBody?: any
    docRevId?: string
  }
}

export interface DocumentSetAction {
  type: typeof DOCUMENT_SET
  payload: Document
}

export interface DocumentRevisionsListAction {
  type: typeof DOCUMENT_REVISION_LIST
  payload: DocumentRevision[]
}

export interface DocumentRevisionsByIdState {
  [key: string]: DocumentRevision
}

export interface DocumentByIdState {
  [key: string]: Document
}

export type DocumentRevisionsAllIdsState = string[];

export type DocumentRevisionTransition = 'pending_submission';

export interface DocumentRevisionTransitionRequestBody {
  password: string
}

export interface DocumentRevisionTransitionResponse {
  id: string
}

export interface DocumentRevisionAuditSetAction {
  type: typeof DOCUMENT_REVISION_AUDIT_SET
  payload: AuditActionPayload
}

export type AllIdsState = string[];

export interface ApproveAndReleaseRequest {
  approvers: Id[]
  effectiveDate?: string
  documentType: Id
  formDocument: Id
}

export interface FinalizeAndReleaseRequest {
  approvers: Id[]
  effectiveDate?: string
}

export interface CreateAndReleaseRequest {
  releasedDocumentRevision: DocumentRevision
  releaseDto: CreateAndReleaseRequest
}

export interface FBFormTemplateProps {
  outputDocumentTypes: FBOutputDocumentType[] | OptionType[]
  schema: FBSchemaProps[]
  helloSignTemplateId?: string
}

export interface FBDocumentRevisionProps {
  id?: string
  formTemplate?: FBFormTemplateProps
  formDocument?: FBDocumentRevisionProps
  formDocumentId?: string
  formInput?: Record<string, any>
  document?: Partial<DocumentRevisionDocumentRequest>
  revision?: number
  subRevision?: number
  revisionStage?: string | number
  revisionChangeType?: RevisionChangeType
  releasedAt?: string
  effectiveDate?: Date
  renderHTML?: string
  renderHTMLDefined?: boolean
  status?: DocumentRevisionStatus
  displayStatus?: string
  tasks?: FBTaskItem[]
  notes?: FBNoteItem[]
}

export interface FBOutputDocumentType {
  id: string
  documentTypeName?: string
  groupOptions?: DocumentGroupOptionsType[]
  active?: boolean
  group?: DocumentGroupType

}

export interface HeaderTableType {
  label: string
  key: string
}

export interface UpdateFormFieldMapping {
  sourceId: string
  targetId: string
}

export interface UpdateFormRequestBody {
  mapping: UpdateFormFieldMapping[]
  formToBeUsed: Id
}

export interface TypeSpecificConfig {
  eqProdEnforceConfig: {
    date: string
    value: boolean
  }
}
