import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListColumnProps, TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { BOM } from '../../interface';
import { ALTERNATE_PART_KEY } from './constants';

export interface FBBOMProps {
  documentRevision: DocumentRevision
  isDisabled: boolean
  showBOMDiff?: boolean
  isShowOnly?: boolean
}

export interface BOMState {
  data: BOM[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
}

interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface FBBOMDrawerTableProps {
  parentRevId?: string
}

export interface EditableAlternatePart extends AlternatePart {
  [MODE_FIELD]: Mode
}

export interface AlternatePartEditEvent {
  dataItem: EditableAlternatePart
}

interface AlternatePart {
  id: string
  name?: string
  revision?: string
  displayRevision?: string
  status?: DocumentRevisionStatus
  displayStatus?: string
  cost?: string
  docId?: string
  leadTime?: string
  [ALTERNATE_PART_KEY]?: boolean
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: BOM
}

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

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  isHidden?: boolean
  isShowedMenu?: boolean
  mainOrderIndex?: number
  disableShowOrHideSelection?: boolean
  filterable?: boolean
}
