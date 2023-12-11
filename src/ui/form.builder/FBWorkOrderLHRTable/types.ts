import { Employee } from '../../../state/ducks/company/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { CellTemplateProps, ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from './constants';

export interface SchemaOptions {
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onRefresh?: () => void
  onDelete?: (dataItem) => void
  isDisabled?: boolean
}

export interface ILHRTableItem {
  lotId?: string
  displayStatus?: string
  owner?: Employee
  partRev?: DocumentRevision
  completionDate?: Date
  startQuantity?: number
  endQuantity?: number
  lhrTemplate?: {id: string, docId: string}
  lhrDetails?: {id: string, docId: string}
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
