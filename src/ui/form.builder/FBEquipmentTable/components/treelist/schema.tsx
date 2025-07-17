import React from 'react';
import { translate } from '../../../../../common/intl';
import { ActionsCell } from './column.templates/Actions';
import ExpiryDateCellTemplate from './column.templates/ExpiryDateCell';
import IDCell from './column.templates/IDCell';
import LotAllocatedCell from './column.templates/LotAllocatedCell';
import { RevHeaderCell } from './column.templates/RevHeader';

export const TreeListSchema = ({
  actionsClass,
  popperHolder,
  onConfirm,
  parentRevId,
}) => {
  return [
    {
      field: 'plannedId',
      title: translate('lhr.equipment.grid.heading.planned.id'),
      width: 350,
      expandable: true,
      locked: false,
      mainOrderIndex: 1,
      cell: (props) => <IDCell {...props} />,
      sortable: false,
    },
    {
      field: 'actualId',
      locked: false,
      title: translate('lhr.equipment.grid.heading.actual.id'),
      width: 350,
      mainOrderIndex: 2,
      cell: (props) => <LotAllocatedCell {...props} addLot={null} parentRevId={parentRevId} deleteLot={null} />,
    },
    {
      field: 'calDueDate',
      locked: false,
      title: translate('lhr.equipment.grid.heading.cal.due.date'),
      width: 200,
      mainOrderIndex: 2,
      cell: (props) => <ExpiryDateCellTemplate {...props} />,
    },
    {
      field: 'pmDueDate',
      locked: false,
      title: translate('lhr.equipment.grid.heading.pm.due.date'),
      width: 200,
      headerCell: RevHeaderCell,
      mainOrderIndex: 3,
    },
    {
      id: 'actions',
      locked: false,
      cell: (props) => (
        <td className={actionsClass}>
          <ActionsCell
            {...props}
            onConfirm={onConfirm}
            // onDiscard={onDiscard}
            // onDelete={onDelete}
            onRestore={undefined}
            rootClassName={popperHolder}
          />
        </td>
      ),
      width: 0,
    },
  ];
};
