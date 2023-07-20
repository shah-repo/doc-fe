import { TreeListColumnProps, TreeListTextFilter } from '@progress/kendo-react-treelist';
import ARIDCell from './column.templates/ARIDCell';
import { BooleanCell } from './column.templates/Boolean';
import CommentsCell from './column.templates/CommentsCell';
import CostCell from './column.templates/CostCell';
import DropdownFilterCell from './column.templates/DropDownFilterCell';
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

export const SUB_ITEMS_FIELD = 'childNodes';
export const DATA_ITEM_KEY = 'id';
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
  mainOrderIndex?: number
  disableShowOrHideSelection?: boolean
}

export const TreeColumns: CustomTreeListColumnProps[] = [
  {
    field: 'customDocId',
    title: 'ID',
    width: '204px',
    filter: TreeListTextFilter,
    expandable: true,
    locked: false,
    mainOrderIndex: 0,
    hidden: false,
    disableShowOrHideSelection: true,
    cell: IDCell,
  },
  {
    field: 'revision',
    title: 'REV',
    width: '106px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 1,
    hidden: false,
    cell: RevisionCell,
  },
  {
    field: 'name',
    title: 'TITLE',
    width: '240px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 2,
    hidden: false,
    cell: TitleCell,
  },
  {
    field: 'arId',
    title: 'AR ID',
    width: '172px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 3,
    hidden: false,
    cell: ARIDCell,
  },
  {
    field: 'status',
    title: 'STATUS',
    width: '157px',
    cell: Status,
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 4,
    hidden: false,
  },
  {
    field: 'cost',
    title: 'COST',
    width: '120px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 5,
    hidden: false,
    cell: CostCell,
  },
  {
    field: 'leadTime',
    title: 'LEAD TIME (Days)',
    width: '171px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 6,
    hidden: false,
    showMenu: false,
    cell: LeadTimeCell,
  },
  {
    field: 'quantity',
    title: 'QTY.',
    width: '139px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 7,
    hidden: false,
    cell: QuantityCell,
  },
  {
    field: 'unit',
    title: 'UNIT',
    width: '232px',
    filter: DropdownFilterCell,
    locked: false,
    mainOrderIndex: 8,
    hidden: false,
    cell: UnitCell,
  },
  {
    field: 'hasChanges',
    title: 'Has Changes',
    width: '171px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 9,
    hidden: false,
    cell: QuantityCell,
  },
  {
    field: 'refDesignator',
    title: 'REF. DESIGNATOR',
    width: '207px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 10,
    hidden: false,
    cell: RefDesignatorCell,
  },
  {
    field: 'comment',
    title: 'COMMENTS',
    width: '241px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 11,
    hidden: false,
    sortable: false,
    cell: CommentsCell,
  },
  {
    field: 'hasPrimaryAttachment',
    title: 'PRIMARY ATTACHMENTS',
    width: '81px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 12,
    headerCell: PrimaryAttachments,
    cell: PrimaryAttachmentsCell,
    hidden: false,
    sortable: false,
  },
  {
    field: 'hasAttachments',
    title: 'ATTACHMENTS',
    width: '80px',
    filter: TreeListTextFilter,
    locked: false,
    mainOrderIndex: 13,
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
    locked: false,
    mainOrderIndex: 14,
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
    locked: false,
    mainOrderIndex: 15,
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
    locked: false,
    mainOrderIndex: 16,
    headerCell: AlternatePartsList,
    hidden: false,
    sortable: false,
  },
];
