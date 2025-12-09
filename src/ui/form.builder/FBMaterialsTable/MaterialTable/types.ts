import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListCellProps, TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../change.request/form/types';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import FBMPIProcedureSelectState from '../../FBMPIProcedureSelect/FBMPIProcedureSelect.state';
import { FBMPIProcedureSelectValue } from '../../FBMPIProcedureSelect/FBMPIProcedureSelect.types';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../FBProcedureItem/FBProcedureItem.types';
import { ADD_FIELD } from './constants';

type MaterialCallback = (dataItem: EditableMaterial) => void;

export interface Material {
  id: string
  title?: string
  type?: string
  lotId?: string
  lotDocId?: string
  lotNumber?: { [key: string]: string }
  unit?: string
  quantity?: number
  items?: Material[]
  paramsId?: string
  isLotAddition?: boolean
  LHRTparameter?: boolean
}

export interface MaterialTableProps {
  name?: string
  isActive: boolean
  isShowOnly?: boolean
  items?: FBProcedureItemConfig[]
  getItem?: (id: string) => string
  handleRemove?: (id: string) => void
  type: FBProcedureItemType
  isEnableOnlyLotAddition?: boolean
  isDesign?: boolean
  isDisabled?: boolean
  saveLot?: (values: EditableMaterial) => void
  editLot?: (values: EditableMaterial) => void
  saveScannedLots?: (lots: EditableMaterial[]) => void
  handleSelectionDelete?: (refId?: string) => void
  mpiProcedureSelectState?: FBMPIProcedureSelectState
  partsSelected?: Array<Partial<FBMPIProcedureSelectValue>>
  isLHRStep?: boolean
  isPendingChange?: boolean
  lhrStepIndex?: number
  isMPIProcedure?: boolean
  isPreview?: boolean
  isEBProcedure?: boolean
  attachments?: Attachment
}

export interface EditableMaterial extends Material {
  attachments?: never[]
  [MODE_FIELD]: boolean
  [ADD_FIELD]: boolean
  isNewAddition?: boolean
  parentPartId?: string
  parentId?: string
  isLotAdditionIconsShown?: boolean
  serialNumber?: string
  selectedLotLabel?: string
}

export interface LotOptions {
  label: string
  value: string
  documentId?: string
}

export interface SchemaOptions {
  isLoading?: boolean
  materialSelectOptions: OptionType[]
  units?: string[]
  parts?: MaterialOption[]
  onConfirm: () => void
  onDiscard: () => void
  actionsClass: string
  popperHolder: string
  onDelete?: MaterialCallback
  onEdit?: MaterialCallback
  addLot?: MaterialCallback
  onScanClick?: MaterialCallback
  onRowClick?: (event: MaterialEditEvent) => void
  onPrimaryChange?: (id: string) => void
  isLHRT?: boolean
  isLHRProductionBuild?: boolean
}

export interface UnitOption {
  value: string
  text: string
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
  isDisabled?: boolean
  materialSelectOptions?: OptionType[]
  units?: string[]
  onClick?: (e: MaterialEditEvent) => void
  onScanClick?: MaterialCallback
  isLHRT?: boolean
  isLHRProductionBuild?: boolean
  isEBProcedure?: boolean
  isLHRS?: boolean
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
