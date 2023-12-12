import { TreeListTextFilter } from '@progress/kendo-react-treelist';
import { translate } from '../../../../../common/intl';
import IDCell from './column.templates/IDCell';

export const TreeListSchema = () => {
  return [
    {
      field: 'itemId',
      title: translate('allocation.treelist.treeColumns.field.itemId.title'),
      width: 140,
      filter: TreeListTextFilter,
      expandable: true,
      locked: false,
      mainOrderIndex: 0,
      disableShowOrHideSelection: true,
      cell: IDCell,
      sortable: false,
    },
    {
      field: 'lotAllocated',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.lotAllocated.title'),
      width: 228,
      filter: TreeListTextFilter,
      mainOrderIndex: 2,
    },
    {
      field: 'qtyNeeded',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyNeeded.title'),
      width: 180,
      filter: TreeListTextFilter,
      mainOrderIndex: 3,
    },
    {
      field: 'variance',
      title: translate('allocation.treelist.treeColumns.field.variance.title'),
      width: 180,
      locked: false,
      filter: TreeListTextFilter,
      mainOrderIndex: 5,
    },
    {
      field: 'issuedQty',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.issuedQty.title'),
      width: 180,
      filter: TreeListTextFilter,
      mainOrderIndex: 6,
    },
    {
      field: 'qtyOnHandBefore',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyOnHandBefore.title'),
      width: 250,
      filter: TreeListTextFilter,
      mainOrderIndex: 7,
    },
    {
      field: 'qtyOnHandAfter',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyOnHandAfter.title'),
      width: 250,
      filter: TreeListTextFilter,
      mainOrderIndex: 9,
    },
  ];
};
