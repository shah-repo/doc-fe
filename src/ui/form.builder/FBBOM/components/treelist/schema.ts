import { TreeListTextFilter } from '@progress/kendo-react-treelist';
import { translate } from '../../../../../common/intl';
import { AlternatePartsCell } from './column.templates/AlternatePartsCell';
import ARIDCell from './column.templates/ARIDCell';
import AttachmentCell from './column.templates/AttachmentCell';
import { BooleanCell } from './column.templates/Boolean';
import CommentsCell from './column.templates/CommentsCell';
import CostCell from './column.templates/CostCell';
import CostRollupCell from './column.templates/CostRollupCell';
import DropdownFilterCell from './column.templates/DropDownFilterCell';
import HasChangesCell from './column.templates/HasChangesCell';
import IDCell from './column.templates/IDCell';
import LeadTimeCell from './column.templates/LeadTimeCell';
import { PrimaryAttachmentsCell } from './column.templates/PrimaryAttachments';
import QuantityCell from './column.templates/QuantityCell';
import RefDesignatorCell from './column.templates/RefDesignatorCell';
import RevisionCell from './column.templates/RevisionCell';
import { Status } from './column.templates/Status';
import TitleCell from './column.templates/TitleCell';
import UnitCell from './column.templates/UnitCell';
import { VendorsCell } from './column.templates/VendorsCell';
import { AlternatePartsList } from './header.templates/AlternatePartsList';
import { Attachments } from './header.templates/Attachments';
import { Issues } from './header.templates/Issues';
import { PrimaryAttachments } from './header.templates/PrimaryAttachments';
import { Vendors } from './header.templates/Vendors';
import { CustomTreeListColumnProps } from './interface';

export const TreeColumns: CustomTreeListColumnProps[] = [
  {
    field: 'customDocId',
    title: translate('bom.treelist.treeColumns.field.customDocId.title'),
    width: 204,
    filter: TreeListTextFilter,
    expandable: true,
    locked: true,
    mainOrderIndex: 0,
    disableShowOrHideSelection: true,
    cell: IDCell,
    sortable: false,
  },
  {
    field: 'displayRevision',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.revision.title'),
    width: 106,
    filter: TreeListTextFilter,
    mainOrderIndex: 1,
    cell: RevisionCell,
  },
  {
    field: 'name',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.name.title'),
    width: 240,
    filter: TreeListTextFilter,
    mainOrderIndex: 2,
    cell: TitleCell,
  },
  {
    field: 'arId',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.arId.title'),
    width: 172,
    filter: TreeListTextFilter,
    mainOrderIndex: 3,
    cell: ARIDCell,
  },
  {
    field: 'displayStatus',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.status.title'),
    width: 157,
    cell: Status,
    filter: TreeListTextFilter,
    mainOrderIndex: 4,
  },
  {
    field: 'costRollUp',
    title: translate('bom.treelist.treeColumns.field.costRollup.title'),
    width: 120,
    locked: false,
    filter: TreeListTextFilter,
    mainOrderIndex: 5,
    cell: CostRollupCell,
  },
  {
    field: 'cost',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.cost.title'),
    width: 120,
    filter: TreeListTextFilter,
    mainOrderIndex: 6,
    cell: CostCell,
  },
  {
    field: 'quantity',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.quantity.title'),
    width: 139,
    filter: TreeListTextFilter,
    mainOrderIndex: 7,
    cell: QuantityCell,
  },
  {
    field: 'leadTime',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.leadTime.title'),
    width: 171,
    filter: TreeListTextFilter,
    mainOrderIndex: 8,
    cell: LeadTimeCell,
  },
  {
    field: 'unit',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.unit.title'),
    width: 232,
    filter: DropdownFilterCell,
    mainOrderIndex: 9,
    cell: UnitCell,
  },
  {
    field: 'hasChanges',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.hasChanges.title'),
    width: 171,
    filter: TreeListTextFilter,
    mainOrderIndex: 10,
    cell: HasChangesCell,
  },
  {
    field: 'refDesignator',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.refDesignator.title'),
    width: 207,
    filter: TreeListTextFilter,
    mainOrderIndex: 11,
    cell: RefDesignatorCell,
  },
  {
    field: 'comment',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.comment.title'),
    width: 241,
    filter: TreeListTextFilter,
    mainOrderIndex: 12,
    cell: CommentsCell,
  },
  {
    field: 'hasPrimaryAttachment',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.hasPrimaryAttachment.title'),
    width: 81,
    mainOrderIndex: 13,
    headerCell: PrimaryAttachments,
    cell: PrimaryAttachmentsCell,
  },
  {
    field: 'hasAttachments',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.hasAttachments.title'),
    width: 80,
    mainOrderIndex: 14,
    headerCell: Attachments,
    cell: AttachmentCell,
  },
  {
    field: 'issues',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.issues.title'),
    width: 80,
    filter: TreeListTextFilter,
    mainOrderIndex: 15,
    cell: BooleanCell,
    headerCell: Issues,
    isHidden: true,
  },
  {
    field: 'vendorsCount',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.vendorsCount.title'),
    width: 80,
    cell: VendorsCell,
    mainOrderIndex: 16,
    headerCell: Vendors,
  },
  {
    field: 'alternatePartsList',
    locked: false,
    title: translate('bom.treelist.treeColumns.field.alternatePartsList.title'),
    width: 80,
    cell: AlternatePartsCell,
    mainOrderIndex: 17,
    headerCell: AlternatePartsList,
  },
];
