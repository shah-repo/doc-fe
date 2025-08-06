import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../../FBProcedureItem/FBProcedureItem.types';
import { EquipmentItem } from '../../interface';

export interface FBEquipmentProps {
  isDisabled: boolean
  isShowOnly?: boolean
  items?: FBProcedureItemConfig[]
  getItem?: (id: string) => string
  handleRemove?: (id: string) => void
  type: FBProcedureItemType
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
