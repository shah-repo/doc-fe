import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListColumnProps, TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { AllocationItem } from '../../interface';

export interface FBAllocationProps {
  documentRevision: DocumentRevision
  isDisabled: boolean
  isShowOnly?: boolean
  isExpandAll?: boolean
}

export interface AllocationState {
  data: AllocationItem[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
}

interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: AllocationItem
}

export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: AllocationItem
}

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  isHidden?: boolean
  isShowedMenu?: boolean
  mainOrderIndex?: number
  disableShowOrHideSelection?: boolean
  filterable?: boolean
}

export interface AllocationResponse {
  bomTreeRelations: AllocationItem[]
  parentRevDetails: AllocationItem
}
