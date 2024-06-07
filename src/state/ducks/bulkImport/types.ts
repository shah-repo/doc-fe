import { FileWithPreview } from '../../../ui/components/forms/fields-next/Dropzone/Dropzone.types';
import { SelectOption } from '../../../ui/components/forms/fields/Select';
import { Group } from '../auth/types';
import { Approval } from '../common/types';
import { DocumentRevisionStatus, EquipmentStatus, LotStatus, POStatusType, Precalc, TypeSpecificConfig, UsedDocumentsInLHRS } from '../documentRevisions/types';
import { CURRENT_STEP, RESET_STEPS, SET_APPROVAL, SET_APPROVALS, SET_BULK_IMPORT, SET_BULK_IMPORTS, SET_DATA_TYPE_FILTER, SET_DATA_TYPES, SET_FORM_DOCUMENTS_TYPE_GROUP, SET_HEADERS, SET_IS_LOADING, SET_IS_LOADING_MAIN, SET_ONLY_ERRORS_TABLE, SET_SELECTED_TYPE, SET_SHOW_TABLE, SET_STATUS_FILTER, SET_TABLE_DATA, SET_TEMPLATE_FILE, SET_XLSX_FILE, UPDATE_ROW_FIELD_TABLE } from './constants';

export interface DataType {
  [key: string]: string
}

export interface BulkImportState {
  bulkImports: BulkImport[]
  isLoading: boolean
  selectedDataType: string
  selectedStatus: string
}

export interface BulkImportStepsState {
  step: number
  dataType: string
  formDocumentsTypeGroupList: FormDocumentTypeGroup[]
  dataTypeList: DataType
  bulkImport: BulkImport | null
  templateFile: FileWithPreview[]
  xlsx: BKAttachmentFile | null
  showTable: boolean
  showErrorsOnly: boolean
  headers: Headers | null
  isLoading: boolean
  tableData: TableRow[]
  approvers: Approver[]
  approval: Approval | null
}

export type BulkImportStepsActions =
ResetSteps |
SetCurrentStep |
SetSelectedDataType |
SetDataTypes |
SetFormDocumentsTypeGroup |
SetBulkImport |
SetTemplateFIle |
SetXlsxFile |
SetShowTable |
SetOnlyErrorsTable |
SetHeaders |
SetTableData |
UpdateRowFieldTable |
SetApprovers |
SetApproval |
SetIsLoading;

export type BulkImportActions =
SetBulkImports |
SetDataTypeFilter |
SetStatusFilter |
SetIsLoadingMain;

// STEPS
export interface ResetSteps {
  type: typeof RESET_STEPS
}

export interface SetCurrentStep {
  type: typeof CURRENT_STEP
  payload: number
}

export interface SetSelectedDataType {
  type: typeof SET_SELECTED_TYPE
  payload: string
}

export interface SetDataTypes {
  type: typeof SET_DATA_TYPES
  payload: DataType
}

export interface SetFormDocumentsTypeGroup {
  type: typeof SET_FORM_DOCUMENTS_TYPE_GROUP
  payload: FormDocumentTypeGroup[]
}

export interface SetBulkImport {
  type: typeof SET_BULK_IMPORT
  payload: BulkImport
}

export interface SetTemplateFIle {
  type: typeof SET_TEMPLATE_FILE
  payload: FileWithPreview[]
}

export interface SetXlsxFile {
  type: typeof SET_XLSX_FILE
  payload: BKAttachmentFile
}

export interface SetShowTable {
  type: typeof SET_SHOW_TABLE
  payload: boolean
}

export interface SetOnlyErrorsTable {
  type: typeof SET_ONLY_ERRORS_TABLE
  payload: boolean
}

export interface SetHeaders {
  type: typeof SET_HEADERS
  payload: Headers
}

export interface SetTableData {
  type: typeof SET_TABLE_DATA
  payload: TableRow[]
}

export interface UpdateRowFieldTable {
  type: typeof UPDATE_ROW_FIELD_TABLE
  payload: UpdateRowFieldTablePayload
}

export interface SetApprovers {
  type: typeof SET_APPROVALS
  payload: Approver[]
}

export interface SetApproval {
  type: typeof SET_APPROVAL
  payload: Approval
}

export interface SetIsLoading {
  type: typeof SET_IS_LOADING
  payload: boolean
}

// MAIN BULK IMPORT
export interface SetBulkImports {
  type: typeof SET_BULK_IMPORTS
  payload: BulkImport[]
}

export interface SetIsLoadingMain {
  type: typeof SET_IS_LOADING_MAIN
  payload: boolean
}

export interface SetDataTypeFilter {
  type: typeof SET_DATA_TYPE_FILTER
  payload: string
}

export interface SetStatusFilter {
  type: typeof SET_STATUS_FILTER
  payload: string
}

interface Document {
  id: string
  docId: string
}

export interface FormDocumentTypeGroup {
  id: string
  displayRevision: string
  description: string
  name: string
  status: string
  document: Document
}

interface Company {
  id: string
}

interface Owner {
  id: string
}

export interface BKAttachmentFile {
  company: Company
  lineType: string
  isCleanCopyRequired: boolean
  name: string
  type: string
  s3link: string
  owner: Owner
  fileSizeS3Link: number
  cleanCopyStatus: string
  companyId: string
  description: string | null
  version: string | null
  s3linkCleanCopy: string | null
  fileSizeS3LinkCleanCopy: number | null
  createdAt: string
  updatedAt: string
  id: string
  billIds: string[]
}

export interface UpdateRowFieldTablePayload {
  cellValue: string
  field: string
  dataIndex: number
}

export interface CustomHeaderEntity {
  id: string
  name: string
}

export interface SystemHeaderEntity extends CustomHeaderEntity {
  required: boolean
  match?: string
}

export interface Headers {
  custom: CustomHeaderEntity[]
  system: SystemHeaderEntity[]
}

export interface TableErrorDetail {
  column: string
  message: string
  row: number
  edited?: boolean
  help?: {
    message: string
    data?: string[]
  }
}

export interface TableRow extends Record<string, string | TableErrorDetail[] | undefined> {
  errors?: TableErrorDetail[]
}

export interface Employee {
  createdAt: string
  updatedAt: string
  id: string
  email: string
  name: string
  confirmed: boolean
  locked: boolean
  passwordExpires: boolean
  passwordLastEmailSentAt: string | null
  passwordUpdatedAt: string
  permissions: string | null
  avatar: string | null
  initialColor: string
  resetPasswordEmailTimestamp: string | null
  resendConfirmationEmailTimestamp: string | null
  forgotPasswordEmailTimestamp: string | null
  passwordSetTimestamp: string | null
}

export interface EmployeeGroup extends Pick<Group, 'id' | 'name' | 'permissions' | 'type' | 'tags'> {
  createdAt: string
  updatedAt: string
  defaultForNewUsers: boolean
  companyId: string
  isOfficial: boolean
}

export interface Approver {
  createdAt: string
  updatedAt: string
  id: string
  companyId: string
  active: boolean
  slackUserId: string | null
  user: Employee
  groups: EmployeeGroup[]
}

export interface ApproverOption extends SelectOption {
  email: string
  avatar: string | null
}

export interface IconsBk {
  icon: string
  text: string
  step: number
}

export interface BulkImportCustom extends BulkImport {
  progress?: number
  icons?: IconsBk[]
  date?: string
}

export interface BulkImport {
  createdAt: string
  updatedAt: string
  id: string
  companyId: string
  processId: string
  xlsx: Xlsx[]
  attachmentId: string
  attachmentLink: string | null
  templateId: string
  status: string
  mappedHeaders: {
    custom: SystemHeaderEntity[]
    system: SystemHeaderEntity[]
  }
  originalHeaders: OriginalHeader[]
  formId: string
  documentRevisionId: string
  documentRevision: DocumentRevision
  dataId: string
  jobId: string
  logs: LogEntry[]
  bulkImportReports: string
  bulkImportCompletedAt: string | null
  bulkImportProcess: BkProcess
  excelFile: BulkImportFile | null
  zipFile: BulkImportFile | null
}

export interface BulkImportFile {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  description: string | null
  type: string
  lineType: string
  version: string | null
  s3link: string
  s3linkCleanCopy: string | null
  billIds: string[]
  cleanCopyStatus: string
  companyId: string
  fileSizeS3Link: number
  fileSizeS3LinkCleanCopy: number | null
}

export enum BkStatus {
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

interface Process {
  name: string
  step: number
  status: BkStatus
  percentage: number
  description: string
}

interface BkProcess {
  process: Process[]
  totalSteps: number
}

interface OriginalHeader {
  id: string
  name: string
}

export interface Xlsx {
  active: boolean
  fileId: string
}

export interface DocumentRevision {
  createdAt: string
  updatedAt: string
  id: string
  version: number
  revision: number
  subRevision: number
  revisionStage: number
  displayRevision: string
  description: string
  name: string
  status: DocumentRevisionStatus
  poStatus: POStatusType
  lotStatus: LotStatus
  eqStatus: EquipmentStatus
  displayStatus: DocumentRevisionStatus
  deprecatedAt: string | null
  effectiveDate: string | null
  approvedAt: string | null
  releasedAt: string | null
  obsoletedAt: string | null
  voidedAt: string | null
  retrain: boolean
  redline: boolean
  formInput: Record<string, string[]>
  inputOwners: Record<string, any>
  downloadAllAttachmentsZipS3Link: string | null
  lastZipFileUpdate: string | null
  documentId: string
  changeRequestId: string | null
  companyId: string
  revisionChangeType: string
  schema: any
  formDocumentId: string | null
  externalId: string | null
  renderHTMLDefined: boolean
  usedDocumentsInLHRS: UsedDocumentsInLHRS[]
  precalc: Precalc
  document: DocumentInfo
  approvals: Approval[]
}

export interface DocumentInfo {
  createdAt: string
  updatedAt: string
  id: string
  docId: string
  companyId: string
  massCreateExecuted: boolean | null
  typeSpecificConfig?: TypeSpecificConfig
}

export enum SNAPSHOT_FIELD_TYPE {
  STRING = 'STRING',
  OBJECT = 'OBJECT',
  NUMBER = 'NUMBER',
  ARRAY = 'ARRAY',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  BOOLEAN = 'BOOLEAN',
}

export enum SNAPSHOT_OPTIONS {
  STRING_NEW = 'STRING_NEW',
  STRING_DELETED = 'STRING_DELETED',
  STRING_EDITED = 'STRING_EDITED',
  NUMBER_NEW = 'NUMBER_NEW',
  NUMBER_DELETED = 'NUMBER_DELETED',
  NUMBER_EDITED = 'NUMBER_EDITED',
  OBJECT_NEW = 'OBJECT_NEW',
  OBJECT_DELETED = 'OBJECT_DELETED',
  OBJECT_EDITED = 'OBJECT_EDITED',
  ARRAY_NEW = 'ARRAY_NEW',
  ARRAY_ADDED = 'ARRAY_ADDED',
  ARRAY_DELETED = 'ARRAY_DELETED',
  ARRAY_EDITED = 'ARRAY_EDITED',
  ARRAY_REMOVED = 'ARRAY_REMOVED',
  BOOLEAN_NEW = 'BOOLEAN_NEW',
  BOOLEAN_DELETED = 'BOOLEAN_DELETED',
  BOOLEAN_EDITED = 'BOOLEAN_EDITED',
  EMAIL_SENT = 'EMAIL_SENT',
  VIEW_PDF = 'VIEW_PDF',
}

export interface LogEntry {
  createdAt: string
  updatedAt: string
  id: string
  changeRequestId: string | null
  documentId: string | null
  documentRevisionId: string | null
  referenceId: string | null
  employeeId: string | null
  userId: string | null
  approvalId: string | null
  companyGroupId: string | null
  type: SNAPSHOT_OPTIONS
  fieldType: SNAPSHOT_FIELD_TYPE
  fieldPath: string
  timestamp: string
  previousValue: string
  nextValue: string
  groupId: string
  ownerId: string
  ownerUserId: string | null
  fileUploadCandidatesId: string | null
  companyId: string
  attachmentId: string | null
  ownerName: string
  ownerEmail: string
  hasPoReceivedQtyFlag: boolean
}
