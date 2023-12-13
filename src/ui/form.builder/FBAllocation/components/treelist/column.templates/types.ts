import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { EditableAllocationItem } from '../../../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableAllocationItem
  openDetailDrawer?: (dataItem: EditableAllocationItem) => void
}

export interface AllocItemActionsProps<EditableAllocationItem> {
  dataItem: EditableAllocationItem
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  onConfirm: () => void
  onDiscard?: (dataItem: EditableAllocationItem) => void
  onDelete?: (dataItem: EditableAllocationItem) => void
  onChildPartAdd?: (dataItem: EditableAllocationItem) => void
  onRestore?: (dataItem: EditableAllocationItem) => void
  onReorder?: () => void
}
