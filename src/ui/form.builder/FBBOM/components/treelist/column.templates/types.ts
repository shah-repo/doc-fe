import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { BOM } from '../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: BOM
}

export interface BOMActionsProps<T> {
  dataItem: T
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  onRestore?: () => void
  onReorder?: () => void
}
