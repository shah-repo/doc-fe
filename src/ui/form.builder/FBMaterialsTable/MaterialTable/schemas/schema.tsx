import React from 'react';
import { translate } from '../../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import { ActionsCell } from '../components/Actions';
import { DateCell } from '../components/DateCell';
import LotIdCellTemplate from '../components/LotIdCellTemplate';
import PlannedIdCellTemplate from '../components/PlannedIdCellTemplate';
import QuantityCell from '../components/QuantityCell';
import UnitsCellTemplate from '../components/UnitsCellTemplate';
import { SchemaOptions } from '../types';

export const buildSchema = ({
  materialSelectOptions,
  allowedEditOptions,
  units,
  onRowClick,
  addLot,
  actionsClass,
  popperHolder,
  onConfirm,
  onDiscard,
  onDelete,
  onScanClick,
  isLHRProductionBuild,
}: SchemaOptions): CustomTreeListColumnProps[] => [
  {
    id: 'title',
    field: 'title',
    title: translate('form.builder.procedure.material.table.material.title'),
    mainOrderIndex: 1,
    cell: (props) => <PlannedIdCellTemplate {...props} materialSelectOptions={materialSelectOptions} allowedEditOptions={allowedEditOptions} onClick={onRowClick} />,
    width: 150,
  },
  {
    id: 'lotId',
    field: 'lotId',
    title: translate('form.builder.procedure.material.table.lot.number.title'),
    cell: (props) => <LotIdCellTemplate {...props} addLot={addLot} onClick={onRowClick} onScanClick={onScanClick} isLHRProductionBuild={isLHRProductionBuild} />,
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
    cell: (props) => <UnitsCellTemplate {...props} onClick={onRowClick} units={units} isLHRS />,
    mainOrderIndex: 5,
    width: 150,
  },
  {
    id: 'expiryDate',
    field: 'expiryDate',
    title: translate('form.builder.procedure.material.table.expiry.date.title'),
    cell: (props) => <DateCell {...props} onClick={onRowClick} isLHRS />,
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
