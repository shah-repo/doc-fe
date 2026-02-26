import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRBuild {
  id: string
  internalType: string
  displayLabel: string
  allowCalOrPm: boolean
  allowExpiredLot: boolean
  allowOverdueQuantityMismatch: boolean
  allowQuantityDiscrepancy: boolean
  requireLotSelection: boolean
  requireEquipmentSelection: boolean
  requireDeviationApproval: boolean
  requireReworkApproval: boolean
  isActive: boolean
}

export enum FBLHRBuildOptions {
  'R&D' = 'R&D',
  Production = 'Production',
  Clinical = 'Clinical',
  'Verification & Validation' = 'Verification & Validation',
}

export enum FBLHRBuildOtherOptions {
  Yes = 'Yes',
  No = 'No',
}

export interface EditableLHRBuild extends LHRBuild, EditableItem {
}
