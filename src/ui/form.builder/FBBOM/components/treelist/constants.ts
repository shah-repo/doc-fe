import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';
import ARIDCell from './column.templates/ARIDCell';
import { BooleanCell } from './column.templates/Boolean';
import CommentsCell from './column.templates/CommentsCell';
import CostCell from './column.templates/CostCell';
import IDCell from './column.templates/IDCell';
import LeadTimeCell from './column.templates/LeadTimeCell';
import { PrimaryAttachmentsCell } from './column.templates/PrimaryAttachments';
import QuantityCell from './column.templates/QuantityCell';
import RefDesignatorCell from './column.templates/RefDesignatorCell';
import RevisionCell from './column.templates/RevisionCell';
import { Status } from './column.templates/Status';
import TitleCell from './column.templates/TitleCell';
import UnitCell from './column.templates/UnitCell';
import { AlternatePartsList } from './header.templates/AlternatePartsList';
import { Attachments } from './header.templates/Attachments';
import { Issues } from './header.templates/Issues';
import { PrimaryAttachments } from './header.templates/PrimaryAttachments';
import { Vendors } from './header.templates/Vendors';

export const SUB_ITEMS_FIELD = 'employees';
export const EXPAND_FIELD = 'expanded';
export const SELECTED_PART_KEY_SEPARATOR = '$$$';
export const CELL_EMPTY_VALUE = '-';
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
    cell: IDCell,
  },
  {
    field: 'displayRevision',
    title: 'REV',
    width: '106px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: RevisionCell,
  },
  {
    field: 'title',
    title: 'TITLE',
    width: '300px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: TitleCell,
  },
  {
    field: 'arId',
    title: 'AR ID',
    width: '200px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: ARIDCell,
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
    cell: CostCell,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME (Days)',
    width: '127px',
    filter: TreeListTextFilter,
    hidden: false,
    showMenu: false,
    cell: LeadTimeCell,
  },
  {
    field: 'quantity',
    title: 'QTY.',
    width: '154px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: QuantityCell,
  },
  {
    field: 'unit',
    title: 'UNIT',
    width: '113px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: UnitCell,
  },
  {
    field: 'hasChanges',
    title: 'Has Changes',
    width: '154px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: QuantityCell,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    width: '207px',
    filter: TreeListTextFilter,
    hidden: false,
    cell: RefDesignatorCell,
  },
  {
    field: 'comments',
    title: 'COMMENTS',
    width: '278px',
    filter: TreeListTextFilter,
    hidden: false,
    sortable: false,
    cell: CommentsCell,
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
    field: 'alternatePartsList',
    title: 'Alternate Parts List',
    width: '80px',
    cell: BooleanCell,
    filter: TreeListTextFilter,
    headerCell: AlternatePartsList,
    hidden: false,
    sortable: false,
  },
];
