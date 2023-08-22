import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { BOM } from '../../types';
import { ALTERNATE_PART_KEY } from './constants';

// ts-unused-exports:disable-next-line
export interface FBBOMProps {
  documentRevision: DocumentRevision
  isDisabled: boolean
  showBOMDiff?: boolean
}

// ts-unused-exports:disable-next-line
export interface BOMState {
  data: BOM[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
}

// ts-unused-exports:disable-next-line
export interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

// ts-unused-exports:disable-next-line
export interface FBBOMDrawerTableProps {
  parentRevId?: string
}

// ts-unused-exports:disable-next-line
export interface EditableAlternatePart extends AlternatePart {
  [MODE_FIELD]: Mode
}

// ts-unused-exports:disable-next-line
export interface AlternatePartEditEvent {
  dataItem: EditableAlternatePart
}

// ts-unused-exports:disable-next-line
export interface AlternatePart {
  id: string
  name?: string
  revision?: string
  status?: string
  cost?: string
  docId?: string
  leadTime?: string
  [ALTERNATE_PART_KEY]?: boolean
}

// ts-unused-exports:disable-next-line
export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: BOM
}

// ts-unused-exports:disable-next-line
export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: BOM
}

export interface WhereUsedTree {
  depth: number
  name: string
  parentDocId: string
  revision: number
  status: string
}
