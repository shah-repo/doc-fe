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
  'V&V' = 'V&V',
}

export interface EditableLHRBuild extends LHRBuild, EditableItem {
}
