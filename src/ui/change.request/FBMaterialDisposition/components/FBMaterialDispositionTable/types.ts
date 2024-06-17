import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface MaterialDispositionItem {
  id: string
  partDocRevId: string
  basePartDocRevId: string
  lotDocRevId: string
  partDocId: string
  revisionsFromTo: string
  lotDocId: string
  lotDocumentId?: string
  arId: string
  onOrderPOAction: string
  inInspectionAction: string
  inInventoryAction: string
  inWipAction: string
  whereUsed: number
  asFinishedGoodsAction: string
  usedLocation: string
  comment: string
  text?: string
  docId?: string
  docRevId?: string
  displayRevision?: string
  openedPO: DocumentRevision[]
  isManuallyAdded?: boolean
  userEnteredItemId?: string
}

export interface MDItemEditRequestBody{
  onOrderPOAction: string
  inInspectionAction: string
  inInventoryAction: string
  inWipAction: string
  asFinishedGoodsAction: string
  usedLocation: string
  comment: string
}

export interface EditableMDItem extends MaterialDispositionItem {
  [MODE_FIELD]: Mode
  isSelected?: boolean
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
  onSelectCell?: (dataItem: EditableMDItem, field: string) => void
}

export interface PendingMDInfoResponse{
  pendingTasksCount: number
  isLotStatusWillBeUpdated: boolean
}

export interface CustomTemplateProps extends CellTemplateProps<EditableMDItem> {
  onClick?: (e: MDItemEditEvent) => void
  onSelectCell?: (dataItem: EditableMDItem, field: string) => void
}

export interface CopiedItems {
  [id: string]: string
  value: string
}
