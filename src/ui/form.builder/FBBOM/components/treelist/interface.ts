import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FBBOMProps {}

export interface BOMState {
  data: BOM[]
  dataState: DataState
  expanded: number[]
}
export interface BOM {
  id: number
  title: string
  displayRevision: string
  displayStatus: string
  cost: string
  docId: string
  leadTime?: string
  quantity?: string
  unit?: string
  refDesignator?: string
  primaryAttachments?: string
  attachments?: boolean
  vendor?: boolean
  issues?: boolean
  comments?: string
  employees?: BOM[]
  inEdit?: boolean
  isNew?: boolean
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
