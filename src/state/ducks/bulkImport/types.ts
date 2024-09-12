import { FileWithPreview } from '../../../ui/components/forms/fields-next/Dropzone/Dropzone.types';
import { SelectOption } from '../../../ui/components/forms/fields/Select';
import { FBSchemaProps } from '../../../ui/form.builder/FBSchema/FBSchema.types';
import { Attachment } from '../attachments/types';
import { Audit } from '../audit/types';
import { Group } from '../auth/types';
import { Approval } from '../common/types';
import { Employee as EmployeeCompany } from '../company/types';
import { DocumentRevisionStatus, EquipmentStatus, InputOwner, LotStatus, POStatusType, Precalc, TypeSpecificConfig, UsedDocumentsInLHRS } from '../documentRevisions/types';
import { CLEAN_UP_MAPPED_HEADERS, CURRENT_STEP, DELETE_BULK_IMPORT, RESET_STEPS, SET_APPROVAL, SET_APPROVALS, SET_BULK_IMPORT, SET_BULK_IMPORTS, SET_DATA_TYPE_FILTER, SET_DATA_TYPES, SET_FORM_DOCUMENTS_TYPE_GROUP, SET_HEADERS, SET_IS_LOADING, SET_IS_LOADING_MAIN, SET_ONLY_ERRORS_TABLE, SET_SELECTED_TYPE, SET_SHOW_TABLE, SET_STATUS_FILTER, SET_TABLE_DATA, SET_TEMPLATE_FILE, SET_XLSX_FILE, UPDATE_ROW_FIELD_TABLE } from './constants';

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
CleanUpMappedHeaders |
SetIsLoading;

export type BulkImportActions =
SetBulkImports |
DeleteBulkImportSuccess |
SetDataTypeFilter |
SetStatusFilter |
SetIsLoadingMain;

// STEPS
interface ResetSteps {
  type: typeof RESET_STEPS
}

interface SetCurrentStep {
  type: typeof CURRENT_STEP
  payload: number
}

interface SetSelectedDataType {
  type: typeof SET_SELECTED_TYPE
  payload: string
}

interface SetDataTypes {
  type: typeof SET_DATA_TYPES
  payload: DataType
}

interface SetFormDocumentsTypeGroup {
  type: typeof SET_FORM_DOCUMENTS_TYPE_GROUP
  payload: FormDocumentTypeGroup[]
}

interface SetBulkImport {
  type: typeof SET_BULK_IMPORT
  payload: BulkImport
}

interface DeleteBulkImportSuccess {
  type: typeof DELETE_BULK_IMPORT
  payload: string
}

interface SetTemplateFIle {
  type: typeof SET_TEMPLATE_FILE
  payload: FileWithPreview[]
}

interface SetXlsxFile {
  type: typeof SET_XLSX_FILE
  payload: BKAttachmentFile
}

interface SetShowTable {
  type: typeof SET_SHOW_TABLE
  payload: boolean
}

interface SetOnlyErrorsTable {
  type: typeof SET_ONLY_ERRORS_TABLE
  payload: boolean
}

interface SetHeaders {
  type: typeof SET_HEADERS
  payload: Headers
}

interface SetTableData {
  type: typeof SET_TABLE_DATA
  payload: TableRow[]
}

interface CleanUpMappedHeaders {
  type: typeof CLEAN_UP_MAPPED_HEADERS
}

interface UpdateRowFieldTable {
  type: typeof UPDATE_ROW_FIELD_TABLE
  payload: UpdateRowFieldTablePayload
}

interface SetApprovers {
  type: typeof SET_APPROVALS
  payload: Approver[]
}

interface SetApproval {
  type: typeof SET_APPROVAL
  payload: Approval
}

interface SetIsLoading {
  type: typeof SET_IS_LOADING
  payload: boolean
}

// MAIN BULK IMPORT
interface SetBulkImports {
  type: typeof SET_BULK_IMPORTS
  payload: BulkImport[]
}

interface SetIsLoadingMain {
  type: typeof SET_IS_LOADING_MAIN
  payload: boolean
}

interface SetDataTypeFilter {
  type: typeof SET_DATA_TYPE_FILTER
  payload: string
}

interface SetStatusFilter {
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

export interface BKAttachmentFile extends Partial<Attachment> {
  company: Company
  isCleanCopyRequired: boolean
  cleanCopyStatus: string
  companyId: string
  description: string | null
  version: string | null
  createdAt: string
  updatedAt: string
  billIds: string[]
}

export interface UpdateRowFieldTablePayload {
  cellValue: string
  field: string
  dataIndex: number
  isEdited?: boolean
}

export interface CustomHeaderEntity {
  id: string
  name: string
}

export interface SystemHeaderEntity extends CustomHeaderEntity {
  required: boolean
  match?: string
}

interface Headers {
  custom: CustomHeaderEntity[]
  system: SystemHeaderEntity[]
}

export enum TableErrorValidation {
  DOC_ID = 'docId',
}

export interface TableErrorDetail {
  column: string
  message: string
  row: number
  edited?: boolean
  help?: {
    message: string
    data?: string[]
    format?: string[]
    validate?: TableErrorValidation
  }
}

export interface TableRow extends Record<string, string | number | TableErrorDetail[] | undefined> {
  errors?: TableErrorDetail[]
}

export interface TableRowWithIdx extends TableRow {
  idx: number
}

interface EmployeeGroup extends Pick<Group, 'id' | 'name' | 'permissions' | 'type' | 'tags'> {
  createdAt: string
  updatedAt: string
  defaultForNewUsers: boolean
  companyId: string
  isOfficial: boolean
}

export interface Approver extends EmployeeCompany {
  createdAt: string
  updatedAt: string
  groups: EmployeeGroup[]
}

export interface ApproverOption extends SelectOption {
  email?: string
  avatar?: string | null
  approvalId?: string
}

interface IconsBk {
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
  processType: string
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
  reports: string
  completedAt: string | null
  process: BkProcess
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
  DELETED = 'DELETED',
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

interface Xlsx {
  active: boolean
  fileId: string
}

interface DocumentRevision {
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
  inputOwners: InputOwner
  downloadAllAttachmentsZipS3Link: string | null
  lastZipFileUpdate: string | null
  documentId: string
  changeRequestId: string | null
  companyId: string
  revisionChangeType: string
  schema: FBSchemaProps[]
  formDocumentId: string | null
  externalId: string | null
  renderHTMLDefined: boolean
  usedDocumentsInLHRS: UsedDocumentsInLHRS[]
  precalc: Precalc
  document: DocumentInfo
  approvals: Approval[]
}

interface DocumentInfo {
  createdAt: string
  updatedAt: string
  id: string
  docId: string
  companyId: string
  massCreateExecuted: boolean | null
  typeSpecificConfig?: TypeSpecificConfig
}

enum FieldType {
  STRING = 'STRING',
  OBJECT = 'OBJECT',
  NUMBER = 'NUMBER',
  ARRAY = 'ARRAY',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  BOOLEAN = 'BOOLEAN',
}

export interface LogEntry extends Partial<Audit> {
  createdAt: string
  updatedAt: string
  changeRequestId: string | null
  documentId: string | null
  referenceId: string | null
  employeeId: string | null
  userId: string | null
  companyGroupId: string | null
  fieldType: FieldType
  fieldPath: string
  ownerId: string
  ownerUserId: string | null
  fileUploadCandidatesId: string | null
  companyId: string
  attachmentId: string | null
  ownerEmail: string
}
