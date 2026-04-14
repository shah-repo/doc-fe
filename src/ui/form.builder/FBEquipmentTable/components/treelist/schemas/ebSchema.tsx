import React from 'react';
import { translate } from '../../../../../../common/intl';
import { ActionsCell } from '../column.templates/Actions';
import { EBDateCell } from '../column.templates/EBDateCell';
import EquipmentIdCell from '../column.templates/EquipmentIdCell';
import IDCell from '../column.templates/IDCell';

export const TreeListEBSchema = ({
  actionsClass,
  equipmentOptions,
  allowedEditEqOptions,
  releasedEquipmentOptions,
  popperHolder,
  getItem,
  addActualId,
  onDiscard,
  onDelete,
  onConfirm,
  parentRevId,
  onScanClick,
  isDisabled,
  isEnableActualIdAddition,
  isEBProcedure,
}) => [
  {
    field: 'plannedId',
    title: translate('lhr.equipment.grid.heading.planned.id'),
    width: 200,
    expandable: true,
    locked: false,
    mainOrderIndex: 1,
    cell: (props) => <IDCell {...props} getItem={getItem} equipmentOptions={equipmentOptions} allowedEditEqOptions={allowedEditEqOptions} isEBProcedure={isEBProcedure} releasedEquipmentOptions={releasedEquipmentOptions} />,
    sortable: false,
  },
  {
    field: 'equipmentId',
    locked: false,
    title: translate('lhr.equipment.grid.heading.actual.id'),
    width: 250,
    mainOrderIndex: 2,
    cell: (props) => <EquipmentIdCell {...props} addActualId={addActualId} isEBProcedure={isEBProcedure} isEnableActualIdAddition={isEnableActualIdAddition} equipmentOptions={equipmentOptions} allowedEditEqOptions={allowedEditEqOptions} parentRevId={parentRevId} deleteLot={null} onScanClick={onScanClick} isDisabled={isDisabled} />,
  },
  {
    field: 'calDueDate',
    locked: false,
    title: translate('lhr.equipment.grid.heading.cal.due.date'),
    width: 200,
    mainOrderIndex: 2,
    cell: (props) => <EBDateCell {...props} equipmentOptions={equipmentOptions} isEBProcedure={isEBProcedure} />,
  },
  {
    field: 'pmDueDate',
    locked: false,
    title: translate('lhr.equipment.grid.heading.pm.due.date'),
    width: 200,
    mainOrderIndex: 3,
    cell: (props) => <EBDateCell {...props} equipmentOptions={equipmentOptions} isEBProcedure={isEBProcedure} />,
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
