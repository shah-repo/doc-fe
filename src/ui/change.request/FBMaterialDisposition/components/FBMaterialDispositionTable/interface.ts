import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface MaterialDispositionItem {
  id: string
  partId: string
  lot: string
  rev: string
  onOrder: string
  Inspection: string
  Inventory: string
  wip: string
  whereUsed: number
  finishedGoods: string
  field: string
  comments: string
}

export interface EditableMDItem extends MaterialDispositionItem {
  [MODE_FIELD]: Mode
}

export interface MDItemEditEvent {
  dataItem: EditableMDItem
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRowClick?: (e: MDItemEditEvent) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableMDItem> {
  onClick?: (e: MDItemEditEvent) => void
}
