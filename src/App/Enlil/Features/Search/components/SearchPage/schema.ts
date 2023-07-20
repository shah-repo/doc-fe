import { ColumnDefinition } from '../../../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import { Document } from '../../types';
import { Status } from '../../../../../../ui/components/common/kendo.column.templates/Status';

const schema: Array<ColumnDefinition<Document>> = [
  {
    id: 'id',
    field: 'typeId',
    title: 'common.id',
    width: 130,
  },
  {
    id: 'revision',
    field: 'revisionName',
    title: 'common.revision',
    width: 120,
  },
  {
    id: 'title',
    field: 'title',
    title: 'common.title',
  },
  {
    id: 'owner',
    field: 'userName',
    title: 'common.owner',
    width: 180,
  },
  {
    id: 'status',
    field: 'status',
    title: 'common.status',
    cell: Status,
    width: 120,
  },
];

export default schema;
