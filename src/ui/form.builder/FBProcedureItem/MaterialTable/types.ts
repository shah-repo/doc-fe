import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListCellProps, TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { FBInputProps } from '../../FBInput/FBInput.types';
import { FBProcedureItemConfig, FBProcedureItemType } from '../FBProcedureItem.types';
import { ADD_FIELD } from './constants';

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
  isShowOnly?: boolean
  items?: FBProcedureItemConfig[]
  getItem?: (id: string) => string
  handleRemove?: (id: string) => void
  type: FBProcedureItemType
}

export interface EditableMaterial extends Material {
  [MODE_FIELD]: boolean
  [ADD_FIELD]: boolean
  isNewAddition?: boolean
}

export type FBScanLotProps = Pick<FBInputProps, 'name' | 'label' | 'disabled'>;

export interface SchemaOptions {
  isLoading?: boolean
  units: string[]
  materialSelectOptions: OptionType[]
  parts?: MaterialOption[]
  onConfirm: () => void
  onDiscard: () => void
  actionsClass: string
  popperHolder: string
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

export interface MaterialEditEvent {
  dataItem: EditableMaterial
}

export interface CustomTreeListCellProps extends TreeListCellProps {
  dataItem: EditableMaterial
  addLot?: MaterialCallback
  deleteLot?: MaterialCallback
  deletePart?: MaterialCallback
  parentRevId?: string
  parts?: MaterialOption[]
  materialSelectOptions?: OptionType[]
  units?: string[]
  unitOptions?: string[]
  onClick?: (e: MaterialEditEvent) => void
}

export type MaterialOption =
& Pick<DocumentRevision, 'id' | 'name' | 'displayRevision' | 'document'>;

export interface MaterialCellActionsProps<EditableMaterial> {
  dataItem: EditableMaterial
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  isAddPartEnabled?: boolean
  onConfirm: () => void
  onDiscard?: MaterialCallback
  onDelete?: MaterialCallback
  onReorder?: () => void
}
