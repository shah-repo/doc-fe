import { TreeListBooleanFilter, TreeListColumnProps, TreeListDateFilter, TreeListNumericFilter, TreeListTextFilter } from '@progress/kendo-react-treelist';

export const subItemsField = 'employees';
export const expandField = 'expanded';
export const columns: TreeListColumnProps[] = [
  {
    field: 'name',
    title: 'Name',
    width: '250px',
    filter: TreeListTextFilter,
    expandable: true,
  },
  {
    field: 'hireDate',
    title: 'Hire Date',
    width: '200px',
    format: '{0:d}',
    filter: TreeListDateFilter,
  },
  {
    field: 'timeInPosition',
    title: 'Year(s) in Position',
    width: '200px',
    filter: TreeListNumericFilter,
  },
  {
    field: 'fullTime',
    title: 'Full Time',
    width: '100px',
    filter: TreeListBooleanFilter,
  },
];
