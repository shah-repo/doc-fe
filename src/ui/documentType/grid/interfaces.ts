import { DocumentType, PageDetails } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { KendoColumn } from '../../components/common/kendo/types';
import { TableColumnProps } from '../../components/table/column/types';
import { TablePanelStateProps } from '../../components/table/types';

export interface KendoPresenterProps {
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[]
  tableName: string
  tableCriteria: TablePanelStateProps
  schema: object
  columns: KendoColumn[]
  headerColumns: TableColumnProps<DocumentRevision>[]
  onRowClick: ((dataItem: any) => void)
  title?: string
  queryUrl: string
  documentTypeCategory?: string
  isByCategory: boolean
  documentType: DocumentType
  documentCategory: PageDetails
}
