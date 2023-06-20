import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';
import { Status } from './column.templates/Status';

export const subItemsField = 'employees';
export const expandField = 'expanded';

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  show: boolean
}

export const columns: CustomTreeListColumnProps[] = [
  {
    field: 'docId',
    title: 'ID',
    width: '250px',
    filter: TreeListTextFilter,
    expandable: true,
    locked: false,
    show: true,
  },
  {
    field: 'title',
    title: 'TITLE',
    width: '350px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    width: '120px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'displayStatus',
    title: 'STATUS',
    width: '200px',
    cell: Status,
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'cost',
    title: 'COST',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'quantity',
    title: 'QUANTITY',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'unit',
    title: 'UNIT',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
];
