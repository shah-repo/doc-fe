import React from 'react';
import { translate } from '../../../../../../common/intl';
import { ActionsCell } from '../column.templates/Actions';
import ActualIdCell from '../column.templates/ActualIdCell';
import { DateCell } from '../column.templates/DateCell';
import { EQStatus } from '../column.templates/EQStatus';
import IDCell from '../column.templates/IDCell';

export const TreeListSchema = ({
  actionsClass,
  equipmentOptions,
  allowedEditEqOptions,
  popperHolder,
  getItem,
  addActualId,
  onDiscard,
  onDelete,
  onConfirm,
  parentRevId,
  onScanClick,
  isEnableActualIdAddition,
  isEBProcedure,
  releasedEquipmentOptions,
  onRowClick,
}) => [
  {
    field: 'plannedId',
    title: translate('lhr.equipment.grid.heading.planned.id'),
    width: 150,
    expandable: true,
    locked: false,
    mainOrderIndex: 1,
    cell: (props) => <IDCell {...props} getItem={getItem} onClick={onRowClick} equipmentOptions={equipmentOptions} allowedEditEqOptions={allowedEditEqOptions} releasedEquipmentOptions={releasedEquipmentOptions} />,
    sortable: false,
  },
  {
    field: 'actualId',
    locked: false,
    title: translate('lhr.equipment.grid.heading.actual.id'),
    width: 150,
    mainOrderIndex: 2,
    cell: (props) => <ActualIdCell {...props} addActualId={addActualId} isEBProcedure={isEBProcedure} isEnableActualIdAddition={isEnableActualIdAddition} equipmentOptions={equipmentOptions} releasedEquipmentOptions={releasedEquipmentOptions} allowedEditEqOptions={allowedEditEqOptions} parentRevId={parentRevId} deleteLot={null} onScanClick={onScanClick} />,
  },
  {
    field: 'eqStatus',
    locked: false,
    title: translate('lhr.equipment.grid.heading.eq.status'),
    width: 150,
    mainOrderIndex: 3,
    cell: (props) => <EQStatus {...props} />,
  },
  {
    field: 'calDueDate',
    locked: false,
    title: translate('lhr.equipment.grid.heading.cal.due.date'),
    width: 150,
    mainOrderIndex: 3,
    cell: (props) => <DateCell {...props} />,
  },
  {
    field: 'pmDueDate',
    locked: false,
    title: translate('lhr.equipment.grid.heading.pm.due.date'),
    width: 150,
    mainOrderIndex: 4,
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
          isEBProcedure={isEBProcedure}
        />
      </td>
    ),
    width: 0,
  },
];
