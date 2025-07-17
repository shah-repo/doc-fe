import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { EquipmentItem } from '../../interface';

export interface FBAllocationProps {
  documentRevision: DocumentRevision
  isDisabled: boolean
  isShowOnly?: boolean
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

export interface AllocationPartBody {
  workOrderId: string
  workOrderPartRevId: string
  partRevId: string
  partQuantityNeeded: number
  partVariance: number
}

export interface AllocationLOTBody {
  workOrderId: string
  partRevId: string
  lotRevId: string
  lotQuantityNeeded: number
  lotVariance: number
}
