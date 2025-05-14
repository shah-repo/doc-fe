import { Permission } from '../../../state/ducks/auth/types';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentTypeById } from '../../../state/ducks/documentRevisions/documentType/types';
import { FBSchemaProps } from '../../form.builder';

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
  fromFormSchema: ISchemaItem[]
  toFormSchema: ISchemaItem[]
  completedAt: string
  status: MIGRATION_STATUS_ENUM
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
  originalFormInput: {[key: string]: string}
  newFormInput: {[key: string]: string}
  proposedAction: REV_ACTION_OPTIONS
  fieldNamesUnmatched: {[key: string]: string}
  runDetails: Array<{runAt: string, status: MIGRATION_STATUS_ENUM, completedAt: string, failureReason?: any}>
  status: MIGRATION_STATUS_ENUM
  isSelected?: boolean // UI only
  approvalStatus: SUPPLIER_REV_MIGRATION_APPROVAL_STATUS_ENUM
  name: string
  email: string
  ownerId: string
  isMapped: boolean
  isAlreadyUpgraded: boolean
}

enum SUPPLIER_REV_MIGRATION_APPROVAL_STATUS_ENUM {
  DEFAULT = 'DEFAULT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

enum REV_ACTION_OPTIONS {
  REVISE_AND_MIGRATE = 'REVISE_AND_MIGRATE',
  MIGRATE_ONLY = 'MIGRATE_ONLY',
  CHECK_FORM_INPUT_ONLY = 'Check Form Input Only',
  RECOVER_ERROR = 'RECOVER_ERROR',
  RECOVER_ERROR_AND_RELEASE = 'RECOVER_ERROR_AND_RELEASE',
}

export enum MIGRATION_STATUS_ENUM {
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
  action: REV_ACTION_OPTIONS
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

export type ISchemaItem = FBSchemaProps & {
  mappedToCount?: number
  mappedFrom?: SourceMapping[]
  tableMappings?: TableRowData[]
};

export interface SourceMapping {
  label: any
  name: string
  type: any
  isShowDirectly: boolean
  localMapping?: {[key: string]: MappingOptions}
}
export interface TableRowData {
  [key: string]: any
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

export type SortDirection = 'asc' | 'desc' | undefined;

export interface MappingOptions {
  text: string
  value: string
}
