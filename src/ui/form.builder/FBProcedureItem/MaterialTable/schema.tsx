// import ActionsCellTemplate from './components/ActionsCellTemplate';
// import { UnitsCellTemplate } from './components/UnitsCellTemplate';
import { TreeListColumnProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../common/intl';
import { ActionsCell } from './components/ActionsCellTemplate';
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
  onOpenQuickView,
  onEdit,
}: SchemaOptions): TreeListColumnProps[] => {
  return [
    {
      id: 'plannedId',
      field: 'plannedId',
      title: translate('form.builder.procedure.material.table.planned.id.title'),
      cell: (props) => <PlannedIdCellTemplate {...props} parts={parts} />,
      width: 150,
    },
    {
      id: 'lotId',
      field: 'lotId',
      title: translate('form.builder.procedure.material.table.lot.number.title'),
      cell: (props) => <LotIdCellTemplate {...props} parts={parts} />,
      width: 150,
    },
    {
      id: 'actualId',
      field: 'actualId',
      title: translate('form.builder.procedure.material.table.actual.id.title'),
      cell: (props) => <ActualIdCellTemplate {...props} parts={parts} />,
      width: 150,
    },
    {
      id: 'quantity',
      field: 'quantity',
      title: translate('form.builder.procedure.material.table.quantity.title'),
      cell: (props) => <QuantityCell {...props} parts={parts} />,
      width: 150,
    },
    {
      id: 'unit',
      field: 'unit',
      title: translate('form.builder.procedure.material.table.unit.title'),
      cell: (props) => <UnitsCellTemplate {...props} units={units} onClick={onRowClick} />,
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
