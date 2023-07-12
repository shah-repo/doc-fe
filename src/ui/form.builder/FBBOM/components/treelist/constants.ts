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
  showMenu?: boolean
  disableShowOrHideSelection?: boolean
}

export const TreeColumns: CustomTreeListColumnProps[] = [
  {
    field: 'docId',
    title: 'ID',
    width: '230px',
    filter: TreeListTextFilter,
    expandable: true,
    locked: false,
    hidden: false,
    disableShowOrHideSelection: true,
    cell: NameCell,
  },
  {
    field: 'title',
    title: 'TITLE',
    width: '200px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: TextInfoCell,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    width: '106px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: TextInfoCell,
  },
  {
    field: 'displayStatus',
    title: 'STATUS',
    width: '167px',
    cell: Status,
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'cost',
    title: 'COST',
    width: '120px',
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME',
    width: '127px',
    filter: TreeListTextFilter,
    hidden: false,
    showMenu: false,
  },
  {
    field: 'quantity',
    title: 'QUANTITY',
    width: '154px',
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'unit',
    title: 'UNIT',
    width: '113px',
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    width: '207px',
    filter: TreeListTextFilter,
    hidden: false,
  },
  {
    field: 'primaryAttachments',
    title: 'PRIMARY ATTACHMENTS',
    width: '81px',
    filter: TreeListTextFilter,
    headerCell: PrimaryAttachments,
    cell: PrimaryAttachmentsCell,
    hidden: false,
    sortable: false,
  },
  {
    field: 'attachments',
    title: 'ATTACHMENTS',
    width: '80px',
    filter: TreeListTextFilter,
    headerCell: Attachments,
    cell: BooleanCell,
    hidden: false,
    sortable: false,
  },
  {
    field: 'issues',
    title: 'ISSUES',
    width: '80px',
    filter: TreeListTextFilter,
    cell: BooleanCell,
    headerCell: Issues,
    hidden: false,
    sortable: false,
  },
  {
    field: 'vendor',
    title: 'VENDORS',
    width: '80px',
    cell: BooleanCell,
    filter: TreeListTextFilter,
    headerCell: Vendors,
    hidden: false,
    sortable: false,
  },
  {
    field: 'comments',
    title: 'COMMENTS',
    width: '278px',
    cell: Comments,
    filter: TreeListTextFilter,
    hidden: false,
    sortable: false,
  },
];
