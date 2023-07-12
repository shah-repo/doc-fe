import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { BOM } from '../../interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FBBOMProps {}

export interface BOMState {
  data: BOM[]
  dataState: DataState
  expanded: number[]
  inEdit: Array<{ id: number, isNew: boolean }>
}

export interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface FBBOMDrawerTableProps {}

export interface AlternateParts {}

export interface AlternatePart {
  title: string
  displayRevision: string
  displayStatus: string
  cost: string
  partId: string
  leadTime?: string
  inEdit?: boolean
  isNew?: boolean
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: BOM
}

export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: BOM
}
