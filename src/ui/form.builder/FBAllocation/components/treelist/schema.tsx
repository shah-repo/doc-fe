import { TreeListTextFilter } from '@progress/kendo-react-treelist';
import { translate } from '../../../../../common/intl';
import { ActionsCell } from './column.templates/Actions';
import IDCell from './column.templates/IDCell';
import React from 'react';
import LotAllocatedCell from './column.templates/LotAllocatedCell';
import QuantityCell from './column.templates/QuantityCell';
import VarianceCell from './column.templates/VarianceCell';

export const TreeListSchema = ({
  addLot,
  actionsClass,
  popperHolder,
  onConfirm,
  onDiscard,
  onDelete,
}) => {
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
      cell: (props) => <LotAllocatedCell {...props} addLot={addLot} />,
    },
    {
      field: 'qtyNeeded',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyNeeded.title'),
      width: 180,
      filter: TreeListTextFilter,
      mainOrderIndex: 3,
      cell: QuantityCell,
    },
    {
      field: 'variance',
      title: translate('allocation.treelist.treeColumns.field.variance.title'),
      width: 180,
      locked: false,
      filter: TreeListTextFilter,
      mainOrderIndex: 5,
      cell: VarianceCell,
    },
    {
      field: 'issuedQty',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.issuedQty.title'),
      width: 180,
      filter: TreeListTextFilter,
      mainOrderIndex: 6,
      cell: QuantityCell,
    },
    {
      field: 'qtyOnHandBefore',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyOnHandBefore.title'),
      width: 250,
      filter: TreeListTextFilter,
      mainOrderIndex: 7,
      cell: QuantityCell,
    },
    {
      field: 'qtyOnHandAfter',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyOnHandAfter.title'),
      width: 250,
      filter: TreeListTextFilter,
      mainOrderIndex: 9,
      cell: QuantityCell,
    },
    {
      id: 'actions',
      locked: false,
      cell: (props) => (
        <td className={actionsClass}>
          <ActionsCell
            {...props}
            onConfirm={onConfirm}
            onDiscard={onDiscard}
            onDelete={onDelete}
            onRestore={undefined}
            rootClassName={popperHolder}
          />
        </td>
      ),
      width: 0,
    },
  ];
};
