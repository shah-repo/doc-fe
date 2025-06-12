import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRBuild {
  id: string
  internalType: string
  label: string
  isActive: boolean
}

export interface EditableLHRBuild extends LHRBuild, EditableItem {
}
