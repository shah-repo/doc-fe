import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { EditableBOM } from '../../../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableBOM
  openDetailDrawer?: (dataItem: EditableBOM) => void
}

export interface BOMActionsProps<EditableBOM> {
  dataItem: EditableBOM
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  onConfirm: () => void
  onDiscard?: (dataItem: EditableBOM) => void
  onDelete?: (dataItem: EditableBOM) => void
  onChildPartAdd?: (dataItem: EditableBOM) => void
  onRestore?: (dataItem: EditableBOM) => void
  onReorder?: () => void
}
