import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';

export const subItemsField = 'employees';
export const expandField = 'expanded';
export const columns: TreeListColumnProps[] = [
  {
    field: 'docId',
    title: 'ID',
    width: '250px',
    filter: TreeListTextFilter,
    expandable: true,
  },
  {
    field: 'title',
    title: 'Title',
    width: '350px',
    filter: TreeListTextFilter,
  },
  {
    field: 'displayRevision',
    title: 'Rev',
    width: '120px',
    filter: TreeListTextFilter,
  },
  {
    field: 'displayStatus',
    title: 'Status',
    width: '200px',
    filter: TreeListTextFilter,
  },
  {
    field: 'cost',
    title: 'Cost',
    width: '200px',
    filter: TreeListTextFilter,
  },
  {
    field: 'leadTime',
    title: 'Lead Time',
    width: '200px',
    filter: TreeListTextFilter,
  },
  {
    field: 'quantity',
    title: 'Quantity',
    width: '200px',
    filter: TreeListTextFilter,
  },
  {
    field: 'unit',
    title: 'Unit',
    width: '200px',
    filter: TreeListTextFilter,
  },
];
