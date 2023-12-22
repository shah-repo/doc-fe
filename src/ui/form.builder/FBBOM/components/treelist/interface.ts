import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { AvailableRevisions, BOM } from '../../interface';
import { ALTERNATE_PART_KEY } from './constants';

export interface FBBOMProps {
  documentRevision: DocumentRevision
  isDisabled: boolean
  isDiffViewEnabled?: boolean
  isShowOnly?: boolean
  isUpgradeDisabled?: boolean
  isMaxDialogOpen?: boolean
  isSliderView?: boolean
  isWO?: boolean
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
  partRevId?: string
  basePartRevId?: string
  isDisabled?: boolean
}

export interface EditableAlternatePart extends AlternatePart {
  [MODE_FIELD]: Mode
}

export interface AlternatePartEditEvent {
  dataItem: EditableAlternatePart
}

export interface AlternatePart {
  id: string
  name?: string
  revision?: string
  displayRevision?: string
  status?: DocumentRevisionStatus
  displayStatus?: string
  cost?: string
  docId?: string
  leadTime?: string
  availableRevisions?: AvailableRevisions
  basePartRevId?: string
  partRevId?: string
  [ALTERNATE_PART_KEY]?: boolean
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: BOM
}

export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: BOM
}

export interface IWhereUsedTree {
  depth: number
  name: string
  parentDocId: string
  parentRevId: string
  revision: number
  status: string
}

export interface BOMResponse {
  bomTreeRelations: BOM[]
  parentRevDetails: BOM
}
