import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import FBMPIProcedureSelectState from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.state';
import { FBMPIProcedureSelectValue } from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.types';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../../FBProcedureItem/FBProcedureItem.types';
import { EditableEquipmentItem, EquipmentItem } from '../../interface';

export interface FBEquipmentProps {
  name?: string
  isDisabled: boolean
  isShowOnly?: boolean
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
  mpiProcedureSelectState?: FBMPIProcedureSelectState
  equipsSelected?: Array<Partial<FBMPIProcedureSelectValue>>
}

export interface EquipmentItemState {
  data: EquipmentItem[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
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
