import { ColumnMenuNumericColumn, ColumnMenuTextColumn } from '@progress/kendo-react-data-tools';
import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';
import { Status } from './column.templates/Status';
import { Attachments } from './header.templates/Attachments';
import { Issues } from './header.templates/Issues';
import { PrimaryAttachments } from './header.templates/PrimaryAttachments';
import { Vendors } from './header.templates/Vendors';

export const subItemsField = 'employees';
export const expandField = 'expanded';

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  show: boolean
}

export const columns: CustomTreeListColumnProps[] = [
  {
    field: 'docId',
    title: 'ID',
    // width: '250px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    expandable: true,
    locked: false,
    show: true,
  },
  {
    field: 'title',
    title: 'TITLE',
    // width: '450px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    // width: '120px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'displayStatus',
    title: 'STATUS',
    // width: '200px',
    cell: Status,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'cost',
    title: 'COST',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuNumericColumn,
    show: true,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME',
    // width: '200px',
    filter: TreeListTextFilter,
    show: true,
  },
  {
    field: 'quantity',
    title: 'QUANTITY',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'unit',
    title: 'UNIT',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'primaryAttachments',
    title: 'PRIMARY ATTACHMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    headerCell: PrimaryAttachments,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'attachments',
    title: 'ATTACHMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    headerCell: Attachments,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
  {
    field: 'issues',
    title: 'ISSUES',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    headerCell: Issues,
    show: true,
  },
  {
    field: 'vendor',
    title: 'VENDORS',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    headerCell: Vendors,
    show: true,
  },
  {
    field: 'comments',
    title: 'COMMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    show: true,
  },
];
