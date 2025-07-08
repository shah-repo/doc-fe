import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRBuild {
  id: string
  internalType: string
  displayLabel: string
  isActive: boolean
}

export interface EditableLHRBuild extends LHRBuild, EditableItem {
}
