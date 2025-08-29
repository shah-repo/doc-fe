import React from 'react';
import { translate } from '../../../../../common/intl';
import { ActionsCell } from './column.templates/Actions';
import ActualIdCell from './column.templates/ActualIdCell';
import { DateCell } from './column.templates/DateCell';
import IDCell from './column.templates/IDCell';
import { RevHeaderCell } from './column.templates/RevHeader';

export const TreeListSchema = ({
  actionsClass,
  equipmentOptions,
  popperHolder,
  getItem,
  addActualId,
  onDiscard,
  onDelete,
  onConfirm,
  parentRevId,
  onScanClick,
  isEnableActualIdAddition,
}) => {
  return [
    {
      field: 'plannedId',
      title: translate('lhr.equipment.grid.heading.planned.id'),
      width: 350,
      expandable: true,
      locked: false,
      mainOrderIndex: 1,
      cell: (props) => <IDCell {...props} getItem={getItem} equipmentOptions={equipmentOptions} />,
      sortable: false,
    },
    {
      field: 'actualId',
      locked: false,
      title: translate('lhr.equipment.grid.heading.actual.id'),
      width: 350,
      mainOrderIndex: 2,
      cell: (props) => <ActualIdCell {...props} addActualId={addActualId} isEnableActualIdAddition={isEnableActualIdAddition} equipmentOptions={equipmentOptions} parentRevId={parentRevId} deleteLot={null} onScanClick={onScanClick} />,
    },
    {
      field: 'calDueDate',
      locked: false,
      title: translate('lhr.equipment.grid.heading.cal.due.date'),
      width: 200,
      mainOrderIndex: 2,
      cell: (props) => <DateCell {...props} />,
    },
    {
      field: 'pmDueDate',
      locked: false,
      title: translate('lhr.equipment.grid.heading.pm.due.date'),
      width: 200,
      headerCell: RevHeaderCell,
      mainOrderIndex: 3,
      cell: (props) => <DateCell {...props} />,
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
            isEnableActualIdAddition={isEnableActualIdAddition}
          />
        </td>
      ),
      width: 0,
    },
  ];
};
