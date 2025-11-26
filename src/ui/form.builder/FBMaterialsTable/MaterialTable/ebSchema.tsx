import React from 'react';
import { translate } from '../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../components/common/treelist/types';
import { ActionsCell } from './components/Actions';
import { Attachments } from './components/Attachments';
import LotIdCellTemplate from './components/LotIdCellTemplate';
import PlannedIdCellTemplate from './components/PlannedIdCellTemplate';
import QuantityCell from './components/QuantityCell';
import UnitsCellTemplate from './components/UnitsCellTemplate';
import { SchemaOptions } from './types';

export const buildEBSchema = ({
  materialSelectOptions,
  units,
  onRowClick,
  addLot,
  actionsClass,
  popperHolder,
  onConfirm,
  onDiscard,
  onDelete,
  isDisabled,
  onScanClick,
}: SchemaOptions): CustomTreeListColumnProps[] => [
  {
    id: 'title',
    field: 'title',
    title: translate('form.builder.procedure.material.table.material.title'),
    mainOrderIndex: 1,
    cell: (props) => <PlannedIdCellTemplate {...props} materialSelectOptions={materialSelectOptions} onClick={onRowClick} />,
    width: 150,
  },
  {
    id: 'lotId',
    field: 'lotId',
    title: translate('form.builder.procedure.material.table.lot.number.title'),
    cell: (props) => <LotIdCellTemplate {...props} addLot={addLot} isDisabled={isDisabled} onClick={onRowClick} onScanClick={onScanClick} isEBProcedure />,
    mainOrderIndex: 2,
    width: 150,
  },
  {
    id: 'quantity',
    field: 'quantity',
    title: translate('form.builder.procedure.material.table.quantity.title'),
    cell: (props) => <QuantityCell {...props} onClick={onRowClick} />,
    mainOrderIndex: 4,
    width: 150,
  },
  {
    id: 'unit',
    field: 'unit',
    title: translate('form.builder.procedure.material.table.unit.title'),
    cell: (props) => <UnitsCellTemplate {...props} onClick={onRowClick} units={units} />,
    mainOrderIndex: 5,
    width: 150,
  },
  {
    id: 'attachments',
    field: 'attachments',
    title: translate('form.builder.procedure.material.table.attachments.title'),
    cell: (props) => <Attachments {...props} onClick={onRowClick} />,
    mainOrderIndex: 6,
    width: 300,
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
