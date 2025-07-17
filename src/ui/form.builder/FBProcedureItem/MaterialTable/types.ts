import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListCellProps, TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { FBInputProps } from '../../FBInput/FBInput.types';

type MaterialCallback = (dataItem: EditableMaterial) => void;

export interface Material {
  id: string
  plannedId?: string
  actualId?: string
  lotId?: string
  lotNumber?: { [key: string]: string }
  unit?: string
  quantity?: number
  items?: Material[]
  isLotAddition?: boolean
}

export interface MaterialTableProps {
  isActive: boolean
}

export interface EditableMaterial extends Material {
  [MODE_FIELD]: Mode
}

export type FBScanLotProps = Pick<FBInputProps, 'name' | 'label' | 'disabled'>;

export interface SchemaOptions {
  isLoading?: boolean
  units: string[]
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: MaterialCallback
  onEdit?: MaterialCallback
  onRowClick?: (e) => void
  onPrimaryChange?: (id: string) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableMaterial) => void
}

export interface UnitOption {
  value: string
  text: string
}

export interface ActionsProps<EditableMaterial> {
  dataItem: EditableMaterial
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  onConfirm: () => void
  onDiscard?: MaterialCallback
  onDelete?: MaterialCallback
  onChildPartAdd?: MaterialCallback
  onRestore?: MaterialCallback
  onReorder?: () => void
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: Material
}

interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface MaterialItemState {
  data: Material[]
  expanded: string[]
  dataState: DataState
  inEdit: Array<{ id: string }>
}

export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: Material
}

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableMaterial
  addLot?: MaterialCallback
  deleteLot?: MaterialCallback
  deletePart?: MaterialCallback
  parentRevId?: string
}
