import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRBuild {
  id: string
  internalType: string
  displayLabel: string
  isActive: boolean
}

export enum FBLHRBuildOptions {
  'R&D' = 'R&D',
  Production = 'Production',
  Clinical = 'Clinical',
  'Verification & Validation' = 'Verification & Validation',
}

export interface EditableLHRBuild extends LHRBuild, EditableItem {
}
