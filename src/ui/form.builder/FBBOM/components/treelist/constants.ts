import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';

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
    locked: true,
    show: true,
  },
  {
    field: 'title',
    title: 'Title',
    width: '350px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'displayRevision',
    title: 'Rev',
    width: '120px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'displayStatus',
    title: 'Status',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'cost',
    title: 'Cost',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'leadTime',
    title: 'Lead Time',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'quantity',
    title: 'Quantity',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'unit',
    title: 'Unit',
    width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
];
