import { ColumnDefinition } from '../../../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import { Document } from '../../types';
import OverflowCellTemplate from './components/OverflowCellTemplate';
import { Status } from '../../../../../../ui/components/common/kendo.column.templates/Status';

const schema: Array<ColumnDefinition<Document>> = [
  {
    id: 'id',
    field: 'typeId',
    title: 'common.id',
    template: OverflowCellTemplate,
    width: 130,
  },
  {
    id: 'revision',
    field: 'revisionName',
    title: 'common.revision',
    template: OverflowCellTemplate,
    width: 110,
  },
  {
    id: 'title',
    field: 'title',
    title: 'common.title',
    template: OverflowCellTemplate,
  },
  {
    id: 'owner',
    field: 'userName',
    title: 'common.owner',
    template: OverflowCellTemplate,
    width: 180,
  },
  {
    id: 'status',
    field: 'status',
    title: 'common.status',
    cell: Status,
    width: 130,
  },
];

export default schema;
