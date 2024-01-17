import { Employee } from '../../../state/ducks/company/types';
import { CellTemplateProps, ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from './constants';

export interface IPrecalcEntry {
  label: string
  docRevId?: string
  documentId?: string
}
export interface ILHRTableItem {
  lotId?: string
  displayStatus?: string
  displayRevision?: string
  owner?: Employee
  partRev?: IPrecalcEntry
  completionDate?: Date
  startQuantity?: number
  endQuantity?: number
  lhrTemplate?: string
  lhrDetails?: IPrecalcEntry
}

export interface EditableLHRTableItem extends ILHRTableItem {
  [MODE_FIELD]: Mode
}

export interface SchemaItem extends ColumnDefinition<EditableLHRTableItem> {}
export type DraftLhrTableItem = Partial<EditableLHRTableItem>;

export interface LHRTableItemEditEvent {
  dataItem: EditableLHRTableItem
}

export interface CustomTemplateProps extends CellTemplateProps<EditableLHRTableItem> {
  onClick?: (e: LHRTableItemEditEvent) => void
}

export interface ILHRAutocompleteOption {
  id: string
  displayStatus: string
  displayRevision: string
  documentId: string
  docId: string
  lotId: string
}
