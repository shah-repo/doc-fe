import { ColumnDefinition } from '../../../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import { Document } from '../../types';
import { Status } from '../../../../../../ui/components/common/kendo.column.templates/Status';

const schema: Array<ColumnDefinition<Document>> = [
  {
    id: 'id',
    field: 'docId',
    title: 'ID',
    width: 130,
  },
  {
    id: 'revision',
    field: 'displayRevision',
    title: 'Revision',
    width: 120,
  },
  {
    id: 'title',
    field: 'revisionName',
    title: 'Title',
  },
  {
    id: 'owner',
    field: 'userName',
    title: 'Owner',
    width: 180,
  },
  {
    id: 'status',
    field: 'status',
    title: 'Status',
    cell: Status,
    width: 120,
  },
];

export default schema;
