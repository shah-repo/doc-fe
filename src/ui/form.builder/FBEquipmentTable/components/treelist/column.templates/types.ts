import { TreeListCellProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { EditableEquipmentItem } from '../../../interface';

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableEquipmentItem
  getItem?: (id: string) => string
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

type IAllocationCallback = (dataItem: EditableEquipmentItem) => void;

export type EquipOption =
& Pick<DocumentRevision, 'id' | 'name' | 'displayRevision' | 'document'>;
