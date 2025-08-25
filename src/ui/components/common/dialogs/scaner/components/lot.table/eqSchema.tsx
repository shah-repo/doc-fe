import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { ColumnDefinition } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import DateCellTemplate from './components/DateCellTemplate';
import { LotIdCellTemplate } from './components/LotIdCellTemplate';
import { EditableScanLot, SchemaOptions } from './types';

export const buildEqSchema = ({
  units,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  onOpenQuickView,
  onEdit,
}: SchemaOptions): Array<ColumnDefinition<EditableScanLot>> => {
  return [
    {
      id: 'lotNumber',
      field: 'lotNumber',
      title: 'scan.lot.grid.lot.number',
      template: (props) => <LotIdCellTemplate {...props} onClick={onRowClick} />,
      filterable: false,
      width: 150,
    },
    // {
    //   id: 'serialNumber',
    //   field: 'serialNumber',
    //   title: 'scan.lot.grid.serial.number',
    //   template: (props) => <SerialNumberCellTemplate {...props} onClick={onRowClick} />,
    //   filterable: false,
    //   width: 150,
    // },
    {
      id: 'calDueDate',
      field: 'calDueDate',
      title: translate('lhr.equipment.grid.heading.cal.due.date'),
      template: (props) => <DateCellTemplate {...props} onClick={onRowClick} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'pmDueDate',
      field: 'pmDueDate',
      title: translate('lhr.equipment.grid.heading.pm.due.date'),
      template: (props) => <DateCellTemplate {...props} onClick={onRowClick} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      width: 75,
      filterable: false,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          isActive={true}
          onEdit={onEdit}
          onDelete={onDelete}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
          onOpenQuickView={onOpenQuickView}
        />
      ),
    },
  ];
};
