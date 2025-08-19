import React from 'react';
import { translate } from '../../../../../common/intl';
import { ActionsCell } from './column.templates/Actions';
import IDCell from './column.templates/IDCell';
import LHRTParameterCell from './column.templates/LHRTParameterCell';

export const TreeListMPISchema = ({
  actionsClass,
  popperHolder,
  getItem,
  onDiscard,
  onDelete,
  onConfirm,
  equipmentOptions,
  parentRevId,
}) => {
  return [
    {
      id: 'title',
      field: 'title',
      title: translate('form.builder.procedure.material.title'),
      mainOrderIndex: 1,
      cell: (props) => <IDCell {...props} getItem={getItem} equipmentOptions={equipmentOptions} />,
      width: 150,
    },
    {
      id: 'LHRTparameter',
      field: 'LHRTparameter',
      title: translate('form.builder.procedure.lhrt.parameter.title'),
      cell: (props) => <LHRTParameterCell {...props} addLot={null} parentRevId={parentRevId} deleteLot={null} />,
      mainOrderIndex: 2,
      width: 150,
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
