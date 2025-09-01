import React from 'react';
import { translate } from '../../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import { ActionsCell } from './column.templates/Actions';
import CalDueDateCell from './column.templates/CalDueDateCell';
import IDCell from './column.templates/IDCell';

export const TreeListLHRTSchema = ({
  actionsClass,
  popperHolder,
  getItem,
  onDiscard,
  onDelete,
  onConfirm,
  equipmentOptions,
  parentRevId,
}): CustomTreeListColumnProps[] => {
  return [
    {
      id: 'title',
      field: 'title',
      title: translate('form.builder.procedure.equipment.grid.title'),
      mainOrderIndex: 1,
      cell: (props) => <IDCell {...props} getItem={getItem} equipmentOptions={equipmentOptions} />,
      width: 150,
    },
    {
      id: 'complianceDueDate',
      field: 'complianceDueDate',
      title: translate('form.builder.procedure.cal.due.date.title'),
      mainOrderIndex: 3,
      cell: (props) => <CalDueDateCell {...props} getItem={getItem} equipmentOptions={equipmentOptions} />,
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
            rootClassName={popperHolder}
          />
        </td>
      ),
      width: 0,
    },
  ];
};
