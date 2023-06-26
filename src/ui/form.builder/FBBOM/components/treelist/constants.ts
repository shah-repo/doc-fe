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

export const SUB_ITEMS_FIELD = 'employees';
export const EXPAND_FIELD = 'expanded';
export const TREELIST_CONFIG = {
  sortable: true,
  reorderable: true,
  resizable: true,
};

export interface CustomTreeListColumnProps extends TreeListColumnProps {
  hidden: boolean
  disableShowOrHideSelection?: boolean
}

export const TreeColumns: CustomTreeListColumnProps[] = [
  {
    field: 'docId',
    title: 'ID',
    // width: '250px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    expandable: true,
    locked: false,
    hidden: false,
    disableShowOrHideSelection: true,
  },
  {
    field: 'title',
    title: 'TITLE',
    // width: '450px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    // width: '120px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'displayStatus',
    title: 'STATUS',
    // width: '200px',
    cell: Status,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'cost',
    title: 'COST',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuNumericColumn,
    hidden: false,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME',
    // width: '200px',
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'quantity',
    title: 'QUANTITY',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'unit',
    title: 'UNIT',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'primaryAttachments',
    title: 'PRIMARY ATTACHMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    headerCell: PrimaryAttachments,
    columnMenu: ColumnMenuTextColumn,
    cell: PrimaryAttachmentsCell,
    hidden: false,
    sortable: false,
  },
  {
    field: 'attachments',
    title: 'ATTACHMENTS',
    // width: '200px',
    filter: TreeListTextFilter,
    headerCell: Attachments,
    columnMenu: ColumnMenuTextColumn,
    cell: BooleanCell,
    hidden: false,
    sortable: false,
  },
  {
    field: 'issues',
    title: 'ISSUES',
    // width: '200px',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    cell: BooleanCell,
    headerCell: Issues,
    hidden: false,
    sortable: false,
  },
  {
    field: 'vendor',
    title: 'VENDORS',
    // width: '200px',
    cell: BooleanCell,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    headerCell: Vendors,
    hidden: false,
    sortable: false,
  },
  {
    field: 'comments',
    title: 'COMMENTS',
    // width: '200px',
    cell: Comments,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
    sortable: false,
  },
];
