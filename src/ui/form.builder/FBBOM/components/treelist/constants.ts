import { ColumnMenuNumericColumn, ColumnMenuTextColumn } from '@progress/kendo-react-data-tools';
import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';
import { BooleanCell } from './column.templates/Boolean';
import { Comments } from './column.templates/Comments';
import { PrimaryAttachmentsCell } from './column.templates/PrimaryAttachments';
import { Status } from './column.templates/Status';
import { Attachments } from './header.templates/Attachments';
import { Issues } from './header.templates/Issues';
import { PrimaryAttachments } from './header.templates/PrimaryAttachments';
import { Vendors } from './header.templates/Vendors';

export const subItemsField = 'employees';
export const expandField = 'expanded';

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  hidden: boolean
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
    hidden: true,
  },
  {
    field: 'title',
    title: 'TITLE',
    // width: '450px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    // width: '120px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
  {
    field: 'displayStatus',
    title: 'STATUS',
    // width: '200px',
    cell: Status,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
  {
    field: 'cost',
    title: 'COST',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuNumericColumn,
    hidden: true,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME',
    // width: '200px',
    filter: TreeListTextFilter,
    hidden: true,
  },
  {
    field: 'quantity',
    title: 'QUANTITY',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
  {
    field: 'unit',
    title: 'UNIT',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
  {
    field: 'primaryAttachments',
    title: 'PRIMARY ATTACHMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    headerCell: PrimaryAttachments,
    columnMenu: ColumnMenuTextColumn,
    cell: PrimaryAttachmentsCell,
    hidden: true,
  },
  {
    field: 'attachments',
    title: 'ATTACHMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    headerCell: Attachments,
    columnMenu: ColumnMenuTextColumn,
    cell: BooleanCell,
    hidden: true,
  },
  {
    field: 'issues',
    title: 'ISSUES',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    cell: BooleanCell,
    headerCell: Issues,
    hidden: true,
  },
  {
    field: 'vendor',
    title: 'VENDORS',
    // width: '200px',
    cell: BooleanCell,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    headerCell: Vendors,
    hidden: true,
  },
  {
    field: 'comments',
    title: 'COMMENTS',
    // width: '200px',
    cell: Comments,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: true,
  },
];
