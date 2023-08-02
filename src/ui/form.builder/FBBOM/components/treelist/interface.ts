import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { TreeListExpandChangeEvent, TreeListRowProps } from '@progress/kendo-react-treelist';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { BOM } from '../../interface';

export interface FBBOMProps {
  documentRevision: DocumentRevision
}

export interface BOMState {
  data: BOM[]
  dataState: DataState
  expanded: string[]
  inEdit: Array<{id: string }>
}

export interface DataState {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
}

export interface FBBOMDrawerTableProps {}

export interface EditableAlternatePart extends AlternatePart {
}

export interface AlternatePartEditEvent {
  dataItem: EditableAlternatePart
}

export interface AlternatePart {
  id: string
  title?: string
  displayRevision?: string
  displayStatus?: string
  cost?: string
  partId?: string
  leadTime?: string
  [MODE_FIELD]?: string
}

export interface CustomTreeListRowProps extends TreeListRowProps {
  dataItem: BOM
}

export interface CustomTreeListExpandChangeEvent extends TreeListExpandChangeEvent {
  dataItem: BOM
}
