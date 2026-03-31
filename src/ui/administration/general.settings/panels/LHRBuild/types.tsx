import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRBuild {
  id: string
  internalType: string
  displayLabel: string
  enforceCurrentCalOrPm: boolean
  enforceNonExpiredLots: boolean
  enforceLotQtyRange: boolean
  enforceQtyReconciliation: boolean
  enforceLotRequired: boolean
  enforceEquipmentRequired: boolean
  enforceDeviationApproval: boolean
  enforceReworkApproval: boolean
  enforceProdLotsOnly: boolean
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
