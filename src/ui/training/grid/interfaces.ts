import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { KendoColumn } from '../../components/common/kendo/types';
import { TablePanelStateProps } from '../../components/table/types';

export interface KendoPresenterProps {
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[]
  tableName: string
  tableCriteria: TablePanelStateProps
  schema: object
  columns: KendoColumn[]
  onRowClick: ((dataItem: any) => void)
  queryUrl: string
  defaultPayloadData: object
}

export enum DateFields {
  CREATED_AT= 'createdAt',
  DUE_ON= 'dueOn',
  COMPLETED_AT='completedAt',
}
