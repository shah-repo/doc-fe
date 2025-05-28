import { ReactNode } from 'react';
import { SortDirectionType } from 'react-virtualized';
import { Permission } from '../../../state/ducks/auth/types';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentTypeById } from '../../../state/ducks/documentRevisions/documentType/types';
import { FBInputType, FBLabelLocaleProps, FBSchemaProps } from '../../form.builder';

export interface BulkMigrationDocType {
  id: string
  documentTypeName: string
  documentTypeAcronym: string
  group: string
  category: string
}

export enum ListType {
  FROM = 'from',
  TO = 'to',
}

export interface BulkMigrationScanDetails {
  id: string
  fromDocumentTypeId: string
  toDocumentTypeId: string
  fromFormRevId: string
  toFormRevId: string
  fromFormSchema: FormFieldSchema[]
  toFormSchema: FormFieldSchema[]
  completedAt: string
  status: MigrationStatus
}

interface MigrationFailureReason {
  code: string
  status: string
  message: string
}

interface FormInputMap {
  [key: string]: string
}

interface RunDetail {
  runAt: string
  status: MigrationStatus
  completedAt: string
  failureReason?: MigrationFailureReason
}

export interface SupplierScanResultRevision {
  id: string
  documentId: string
  docId: string
  docRevId: string
  docRevName: string
  displayRevision: string
  displayStatus: string
  owner: Employee
  originalFormInput: FormInputMap
  newFormInput: FormInputMap
  fieldNamesUnmatched: FormInputMap
  runDetails: RunDetail[]
  status: MigrationStatus
  approvalStatus: SupplierMigrationApprovalStatus
  proposedAction: MigrationAction
  name: string
  email: string
  ownerId: string
  isMapped: boolean
  isAlreadyUpgraded: boolean
  isSelected?: boolean
}

enum SupplierMigrationApprovalStatus {
  DEFAULT = 'DEFAULT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

enum MigrationAction {
  REVISE_AND_MIGRATE = 'REVISE_AND_MIGRATE',
  MIGRATE_ONLY = 'MIGRATE_ONLY',
  CHECK_FORM_INPUT_ONLY = 'Check Form Input Only',
  RECOVER_ERROR = 'RECOVER_ERROR',
  RECOVER_ERROR_AND_RELEASE = 'RECOVER_ERROR_AND_RELEASE',
}

export enum MigrationStatus {
  INITIALIZED = 'INITIALIZED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  MAPPING = 'MAPPING',
}

export interface SelectedItemDetails {
  docRevId: string
  action: MigrationAction
}

export interface ApprovalRequirements {
  email: string
  requiredGroups: ApprovalRequirementGroup[]
  missingGroups: ApprovalRequirementGroup[]
  docFormWithAvailableForms: DocumentTypeById
}

export interface ApprovalRequirementGroup {
  id: string
  name: string
  permissions: Permission[]
}

export type FormFieldSchema = FBSchemaProps & {
  mappedToCount?: number
  mappedFrom?: SourceMapping[]
  tableMappings?: TableRowData[]
};

export interface LocalMappingOption {
  [key: string]: MappingOptions
}

export interface SourceMapping {
  label?: string | ReactNode | FBLabelLocaleProps
  name: string
  type?: FBInputType
  isShowDirectly: boolean
  localMapping?: LocalMappingOption
  rules?: string
}

export interface TableRowData {
  [key: string]: SourceMapping[] | null | undefined
}

export interface MismatchResponse {
  newRevIds: string[]
  alreadyUpgradedScanEntryIds?: number[]
  irrelevantScanIds: number[]
  mismatchingStatusScanIds: number[]
}

export interface DetailedScanResult extends MismatchResponse {
  scanDetails: BulkMigrationScanDetails
}

export interface MappingOptions {
  text: string
  value: string
}

export interface ScanFetchOptions {
  offset: number
  limit: number
  orderBy: string
  sortOrder: SortDirectionType
  showActionableOnly: boolean
}
