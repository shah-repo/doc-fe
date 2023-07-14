import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { EditableBOM } from '../../../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableBOM
}

export interface BOMActionsProps<EditableBOM> {
  dataItem: EditableBOM
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  onConfirm: () => void
  onDiscard?: (dataItem: EditableBOM) => void
  onDelete?: (dataItem: EditableBOM) => void
  onRestore?: () => void
  onReorder?: () => void
}
