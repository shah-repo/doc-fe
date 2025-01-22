import { Permission } from '../../../state/ducks/auth/types';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentTypeById } from '../../../state/ducks/documentRevisions/documentType/types';
import { FBSchemaProps } from '../../form.builder';

export interface IBulkMigrationDocumentType {
  id: string
  documentTypeName: string
  documentTypeAcronym: string
  group: string
  category: string
}

export interface IBulkMigrationScanDetails {
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

export interface ISupplierScanResultRev {
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

export interface ISelectedDetails {
  id: string
  action: REV_ACTION_OPTIONS
}

export interface IApprovalRequirements {
  email: string
  requiredGroups: IApprovalRequirementGroup[]
  missingGroups: IApprovalRequirementGroup[]
  docFormWithAvailableForms: DocumentTypeById
}

export interface IApprovalRequirementGroup {
  id: string
  name: string
  permissions: Permission[]
}

export type ISchemaItem = FBSchemaProps & {
  mappedToCount?: number
  mappedFrom?: IMappedFrom[]
  tableMappings?: IRowData[]
};

export interface IMappedFrom {
  label: any
  name: string
  type: any
  isShowDirectly: boolean
}
export interface IRowData {
  [key: string]: any
}

export enum IReferenceDataType {
  ARRAY = 'array',
  OBJECT = 'object',
}

export type SortDirection = 'asc' | 'desc' | undefined;
export const INTERVAL_DURATION = 10000;
