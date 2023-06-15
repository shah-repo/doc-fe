import { Status } from '../../../../components/common/kendo.column.templates/Status';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { AlternateParts } from '../treelist/interface';

export const columns: Array<ColumnDefinition<AlternateParts>> = [
  {
    id: 'partId',
    field: 'partId',
    title: 'PART ID',
    width: '150px',
  },
  {
    id: 'displayRevision',
    field: 'displayRevision',
    title: 'REV',
    width: '70px',
  },
  {
    id: 'title',
    field: 'title',
    title: 'TITLE',
    width: '160px',
  },
  {
    id: 'cost',
    field: 'cost',
    title: 'COST',
    width: '90px',
  },
  {
    id: 'leadTime',
    field: 'leadTime',
    title: 'LEAD TIME',
    width: '110px',
  },
  {
    id: 'displayStatus',
    field: 'displayStatus',
    title: 'STATUS',
    template: Status,
    width: '170px',
  },
];
