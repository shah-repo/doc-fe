import { TreeListColumnProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';

export interface LHRSummaryItem {
  id: string
  type: string
  step: string
  plannedId: string
  actualId: string
  title: string
  lotOrEquipment?: string
  equipmentId?: string
  mpiId?: string
  stepOrMPI: string
  expiryDate?: string
  startQuantity: number
  endQuantity: number
  status: string
  calDueDate: string
  pmDueDate: string
  ncmr: string
  comments: string
  enteredBy: string
  createdAt: string
}

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  isHidden?: boolean
  isShowedMenu?: boolean
  mainOrderIndex?: number
  disableShowOrHideSelection?: boolean
  filterable?: boolean
  show?: boolean
  selectable?: boolean
}

export interface EditableLHRSummaryItem extends LHRSummaryItem {
  [MODE_FIELD]: Mode
  isSelected?: boolean
}

export interface EditableLHRSummaryItemEditEvent {
  dataItem: EditableLHRSummaryItem
}

export interface LHRSummaryRequestBody {
  type: string
  lhrDocRevId?: string
  stepOrMPI: string
  plannedId: string
  plannedDocRevId: string
  actualId: string
  actualDocRevId: string
  lotOrEquipment: string
  lotOrEquipmentDocRevId: string
  startQuantity: number
  endQuantity: number
  status: string
  enteredBy: string
  expiryDate: Date
  calDueDate: Date
  pmDueDate: Date
  date: Date
  comments: string
}

export interface SchemaOptions {
  actionsClass: string
  mpiDocuments: DocumentRevision[]
  equipmentDocs: DocumentRevision[]
  partDocs: DocumentRevision[]
  lotDocs: DocumentRevision[]
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRowClick?: (e: EditableLHRSummaryItemEditEvent) => void
  onSelectCell?: (dataItem: EditableLHRSummaryItem, field: string) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableLHRSummaryItem> {
  onClick?: (e: EditableLHRSummaryItemEditEvent) => void
  onSelectCell?: (dataItem: EditableLHRSummaryItem, field: string) => void
}
