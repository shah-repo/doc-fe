import React from 'react';
import { translate } from '../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../components/common/treelist/types';
import { ActionsCell } from './components/Actions';
import ActualIdCellTemplate from './components/ActualIdCellTemplate';
import LotIdCellTemplate from './components/LotIdCellTemplate';
import PlannedIdCellTemplate from './components/PlannedIdCellTemplate';
import QuantityCell from './components/QuantityCell';
import { UnitsCellTemplate } from './components/UnitsCellTemplate';
import { SchemaOptions } from './types';

export const buildSchema = ({
  units,
  parts,
  onRowClick,
  actionsClass,
  popperHolder,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): CustomTreeListColumnProps[] => {
  return [
    {
      id: 'plannedId',
      field: 'plannedId',
      title: translate('form.builder.procedure.material.table.planned.id.title'),
      mainOrderIndex: 1,
      cell: (props) => <PlannedIdCellTemplate {...props} />,
      width: 150,
    },
    {
      id: 'lotId',
      field: 'lotId',
      title: translate('form.builder.procedure.material.table.lot.number.title'),
      cell: (props) => <LotIdCellTemplate {...props} parts={parts} />,
      mainOrderIndex: 2,
      width: 150,
    },
    {
      id: 'actualId',
      field: 'actualId',
      title: translate('form.builder.procedure.material.table.actual.id.title'),
      cell: (props) => <ActualIdCellTemplate {...props} parts={parts} />,
      mainOrderIndex: 3,
      width: 150,
    },
    {
      id: 'quantity',
      field: 'quantity',
      title: translate('form.builder.procedure.material.table.quantity.title'),
      cell: (props) => <QuantityCell {...props} parts={parts} />,
      mainOrderIndex: 4,
      width: 150,
    },
    {
      id: 'unit',
      field: 'unit',
      title: translate('form.builder.procedure.material.table.unit.title'),
      cell: (props) => <UnitsCellTemplate {...props} units={units} onClick={onRowClick} />,
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
            onDelete={onDelete}
            rootClassName={popperHolder}
          />
        </td>
      ),
      width: 0,
    },
  ];
};
