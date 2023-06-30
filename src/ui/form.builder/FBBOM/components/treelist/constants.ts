import { ColumnMenuNumericColumn, ColumnMenuTextColumn } from '@progress/kendo-react-data-tools';
import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';
import { BooleanCell } from './column.templates/Boolean';
import { Comments } from './column.templates/Comments';
import NameCell from './column.templates/NameCell';
import { PrimaryAttachmentsCell } from './column.templates/PrimaryAttachments';
import { Status } from './column.templates/Status';
import TextInfoCell from './column.templates/TextInfoCell';
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
    width: '12.57%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    expandable: true,
    locked: false,
    hidden: false,
    disableShowOrHideSelection: true,
    cell: NameCell,
  },
  {
    field: 'title',
    title: 'TITLE',
    width: '11.29%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
    cell: TextInfoCell,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    width: '3.86%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
    cell: TextInfoCell,
  },
  {
    field: 'displayStatus',
    title: 'STATUS',
    width: '8.81%',
    cell: Status,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'cost',
    title: 'COST',
    width: '5.94%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuNumericColumn,
    hidden: false,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME',
    width: '6.34%',
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'quantity',
    title: 'QUANTITY',
    width: '5.35%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'unit',
    title: 'UNIT',
    width: '5.35%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    width: '8.81%',
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
  },
  {
    field: 'primaryAttachments',
    title: 'PRIMARY ATTACHMENTS',
    width: '4.06%',
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
    width: '3.96%',
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
    width: '3.96%',
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
    width: '3.96%',
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
    width: '15.64%',
    cell: Comments,
    filter: TreeListTextFilter,
    columnMenu: ColumnMenuTextColumn,
    hidden: false,
    sortable: false,
  },
];
