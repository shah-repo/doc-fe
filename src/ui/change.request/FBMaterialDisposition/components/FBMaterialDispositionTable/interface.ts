import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface MaterialDispositionItem {
  id: string
  partDocRevId: string
  partDocId: string
  revisionsFromTo: string
  lotDocId: string
  arId: string
  onOrderPOAction: string
  inInspectionAction: string
  inInventoryAction: string
  inWipAction: string
  whereUsed: number
  asFinishedGoodsAction: string
  usedLocation: string
  comment: string
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
