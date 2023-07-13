import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { EditableBOM } from '../../../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableBOM
}

export interface BOMActionsProps<T> {
  dataItem: T
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  onConfirm: () => void
  onDiscard?: (T) => void
  onDelete?: (T) => void
  onRestore?: () => void
  onReorder?: () => void
}
