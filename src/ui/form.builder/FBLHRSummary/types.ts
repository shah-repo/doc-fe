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
  issue?: string
  stepOrMPI: string
  expiryDate?: null | string
  startQuantity: number
  endQuantity: number
  lotStatus: string
  calDueDate?: null | string
  pmDueDate?: null | string
  ncmr: string
  comments: string
  enteredBy: string
  createdAt?: null | string
  lotOrEqDocId?: string
  lotOrEqDocumentId?: string
  actualDocId?: string
  actualDocumentId?: string
  plannedDocId?: string
  plannedDocumentId?: string
  issueDocId?: string
  issueDocumentId?: string
  stepOrMpiDocId?: string
  stepOrMpiDocumentId?: string
}

export interface RecordsResponse {
  results: DocumentRevision[]
  totalCount: number
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
  prevActualDocId?: string
  prevActualId?: string
}

export interface EditableLHRSummaryItemEditEvent {
  dataItem: EditableLHRSummaryItem
}

export interface LHRSummaryRequestBody {
  type: string
  lhrDocRevId?: string
  stepOrMPI: string
  plannedId: string
  actualId: string
  lotOrEquipment: string
  startQuantity: number
  endQuantity: number
  lotStatus: string
  enteredBy: string
  expiryDate: Date
  calDueDate: Date
  pmDueDate: Date
  date: Date
  comments: string
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
  onClick?: (e: EditableLHRSummaryItemEditEvent) => void
  onSelectCell?: (dataItem: EditableLHRSummaryItem, field: string) => void
}

interface DueDateCombined extends DocumentRevision{
  calDueDate: string
  pmDueDate: string
}

export interface LHRSummaryOptionsResponse {
  items: DueDateCombined[]
  totalCount: number
}
