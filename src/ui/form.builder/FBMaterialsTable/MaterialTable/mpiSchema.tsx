import React from 'react';
import { translate } from '../../../../common/intl';
import { CustomTreeListColumnProps } from '../../../components/common/treelist/types';
import { ActionsCell } from './components/Actions';
import LHRTParameterCellTemplate from './components/LHRTParameterCellTemplate';
import PlannedIdCellTemplate from './components/PlannedIdCellTemplate';
import QuantityCell from './components/QuantityCell';
import UnitsCellTemplate from './components/UnitsCellTemplate';
import { SchemaOptions } from './types';

export const buildMPISchema = ({
  materialSelectOptions,
  onRowClick,
  addLot,
  actionsClass,
  popperHolder,
  onConfirm,
  onDiscard,
  onDelete,
  isDisabled,
  onScanClick,
}: SchemaOptions): CustomTreeListColumnProps[] => {
  return [
    {
      id: 'plannedId',
      field: 'plannedId',
      title: translate('form.builder.procedure.material.title'),
      mainOrderIndex: 1,
      cell: (props) => <PlannedIdCellTemplate {...props} materialSelectOptions={materialSelectOptions} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'LHRTparameter',
      field: 'LHRTparameter',
      title: translate('form.builder.procedure.lhrt.parameter.title'),
      cell: (props) => <LHRTParameterCellTemplate {...props} addLot={addLot} isDisabled={isDisabled} onClick={onRowClick} onScanClick={onScanClick} />,
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
      cell: (props) => <UnitsCellTemplate {...props} onClick={onRowClick} />,
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
