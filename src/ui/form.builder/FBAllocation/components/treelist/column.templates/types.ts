import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { EditableAllocationItem } from '../../../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableAllocationItem
  openDetailDrawer?: IAllocationCallback
  addLot?: IAllocationCallback
  deleteLot?: IAllocationCallback
  deletePart?: IAllocationCallback
  parentRevId?: string
}

export interface AllocItemActionsProps<EditableAllocationItem> {
  dataItem: EditableAllocationItem
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  onConfirm: () => void
  onDiscard?: IAllocationCallback
  onDelete?: IAllocationCallback
  onChildPartAdd?: IAllocationCallback
  onRestore?: IAllocationCallback
  onReorder?: () => void
}

export interface LotAutoCompleteOptions {
  label: string
  value: string
  isExpired?: boolean
  expiryDate?: string
}

type IAllocationCallback = (dataItem: EditableAllocationItem) => void;
