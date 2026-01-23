import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import FBMPIProcedureSelectState from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.state';
import { FBMPIProcedureSelectValue } from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.types';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../../FBProcedureItem/FBProcedureItem.types';
import { EditableEquipmentItem, EquipmentItem } from '../../types';

export interface FBEquipmentProps {
  name?: string
  isDisabled: boolean
  isShowOnly?: boolean
  isPreview?: boolean
  isPendingChange?: boolean
  items?: FBProcedureItemConfig[]
  getItem?: (id: string) => string
  handleRemove?: (id: string) => void
  type: FBProcedureItemType
  isDesign?: boolean
  isLHRStep?: boolean
  lhrStepIndex?: number
  isMPIProcedure?: boolean
  isEnableActualIdAddition?: boolean
  saveActualEquipment?: (values: EditableEquipmentItem) => void
  saveScannedEquipments?: (equipments: EditableEquipmentItem[]) => void
  handleSelectionDelete?: (refId?: string) => void
  mpiProcedureSelectState?: FBMPIProcedureSelectState
  equipsSelected?: Array<Partial<FBMPIProcedureSelectValue>>
  isEBProcedure?: boolean
}

export interface EquipmentItemState {
  data: EquipmentItem[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
}

export interface MapSelectedByParentEquipId {
  [key: string]: Array<Partial<FBMPIProcedureSelectValue>>
}

interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: EquipmentItem
}

export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: EquipmentItem
}
