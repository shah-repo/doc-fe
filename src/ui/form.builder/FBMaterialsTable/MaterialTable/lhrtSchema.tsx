import React from 'react';
import { translate } from '../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../components/common/treelist/types';
import { ActionsCell } from './components/Actions';
import PlannedIdCellTemplate from './components/PlannedIdCellTemplate';
import QuantityCell from './components/QuantityCell';
import UnitsCellTemplate from './components/UnitsCellTemplate';
import { SchemaOptions } from './types';

export const buildLHRTSchema = ({
  materialSelectOptions,
  onRowClick,
  actionsClass,
  popperHolder,
  onConfirm,
  onDiscard,
  isLHRT,
}: SchemaOptions): CustomTreeListColumnProps[] => [
  {
    id: 'title',
    field: 'title',
    title: translate('form.builder.procedure.material.title'),
    mainOrderIndex: 1,
    cell: (props) => <PlannedIdCellTemplate {...props} materialSelectOptions={materialSelectOptions} onClick={onRowClick} isLHRT={isLHRT} />,
    width: 150,
  },
  {
    id: 'quantity',
    field: 'quantity',
    title: translate('form.builder.procedure.material.table.quantity.title'),
    cell: (props) => <QuantityCell {...props} onClick={onRowClick} isLHRT />,
    mainOrderIndex: 4,
    width: 150,
  },
  {
    id: 'unit',
    field: 'unit',
    title: translate('form.builder.procedure.material.table.unit.title'),
    cell: (props) => <UnitsCellTemplate {...props} onClick={onRowClick} isLHRT />,
    mainOrderIndex: 5,
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
