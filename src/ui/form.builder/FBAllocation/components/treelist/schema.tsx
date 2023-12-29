import { TreeListTextFilter } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ActionsCell } from './column.templates/Actions';
import IDCell from './column.templates/IDCell';
import IssuedQtyCell from './column.templates/IssuedQtyCell';
import LotAllocatedCell from './column.templates/LotAllocatedCell';
import QuantityCell from './column.templates/QuantityCell';
import QuantityOnHandAfter from './column.templates/QuantityOnHandAfter';
import QuantityOnHandBefore from './column.templates/QuantityOnHandBefore';
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
      field: 'partRevId',
      title: translate('allocation.treelist.treeColumns.field.itemId.title'),
      width: 140,
      filter: TreeListTextFilter,
      expandable: true,
      locked: false,
      mainOrderIndex: 1,
      disableShowOrHideSelection: true,
      cell: IDCell,
      sortable: false,
    },
    {
      field: 'lotDocId',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.lotAllocated.title'),
      width: 228,
      filter: TreeListTextFilter,
      mainOrderIndex: 2,
      cell: (props) => <LotAllocatedCell {...props} addLot={addLot} />,
    },
    {
      field: 'quantityNeeded',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.quantityNeeded.title'),
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
      mainOrderIndex: 4,
      cell: VarianceCell,
    },
    {
      field: 'issuedQty',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.issuedQty.title'),
      width: 180,
      filter: TreeListTextFilter,
      mainOrderIndex: 5,
      cell: IssuedQtyCell,
    },
    {
      field: 'qtyOnHandBefore',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyOnHandBefore.title'),
      width: 250,
      filter: TreeListTextFilter,
      mainOrderIndex: 6,
      cell: QuantityOnHandBefore,
    },
    {
      field: 'qtyOnHandAfter',
      locked: false,
      title: translate('allocation.treelist.treeColumns.field.qtyOnHandAfter.title'),
      width: 250,
      filter: TreeListTextFilter,
      mainOrderIndex: 7,
      cell: QuantityOnHandAfter,
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
