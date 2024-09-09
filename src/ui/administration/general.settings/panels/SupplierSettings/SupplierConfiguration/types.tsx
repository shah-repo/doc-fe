import { EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableASLStatus extends ASLStatus, EditableItem {
}

export enum ASLInternalType {
  Approved = 'Approved',
  PendingEvaluation = 'Pending Evaluation',
  Inactive = 'Inactive',
  Disqualify = 'Disqualify',
}

export interface ASLStatus {
  id: string
  supplierType: ASLInternalType
  supplierCapabilities: string[]
  supplierServices: string[]
}
