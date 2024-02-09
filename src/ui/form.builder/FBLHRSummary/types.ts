import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRSummaryItem {
  id: string
  type: string
  step: string
  plannedId: string
  actualId: string
  title: string
  lotId?: string
  equipmentId?: string
  mpiId?: string
  expiryDate?: string
  startQuantity: number
  endQuantity: number
  status: string
  calDueDate: string
  pmDueDate: string
  ncmr: string
  comments: string
  createdBy: string
  createdAt: string
}

export interface EditableLHRSummaryItem extends LHRSummaryItem {
  [MODE_FIELD]: Mode
  isSelected?: boolean
}

export interface EditableLHRSummaryItemEditEvent {
  dataItem: EditableLHRSummaryItem
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRowClick?: (e: EditableLHRSummaryItemEditEvent) => void
  onSelectCell?: (dataItem: EditableLHRSummaryItem, field: string) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableLHRSummaryItem> {
  onClick?: (e: EditableLHRSummaryItem) => void
  onSelectCell?: (dataItem: EditableLHRSummaryItem, field: string) => void
}
