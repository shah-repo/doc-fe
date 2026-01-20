import React from 'react';
import { translate } from '../../../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../../../components/common/treelist/types';
import { ActionsCell } from '../column.templates/Actions';
import IDCell from '../column.templates/IDCell';

export const TreeListLHRTSchema = ({
  actionsClass,
  popperHolder,
  getItem,
  onDiscard,
  onDelete,
  onConfirm,
  equipmentOptions,
  allowedEditEqOptions,
  releasedEquipmentOptions,
  parentRevId,
  onRowClick,
}): CustomTreeListColumnProps[] => [
  {
    id: 'title',
    field: 'title',
    title: translate('form.builder.procedure.equipment.grid.title'),
    mainOrderIndex: 1,
    cell: (props) => <IDCell {...props} getItem={getItem} onClick={onRowClick} equipmentOptions={equipmentOptions} releasedEquipmentOptions={releasedEquipmentOptions} />,
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
