import React from 'react';
import { ColumnDefinition } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import DateCellTemplate from './components/DateCellTemplate';
import { LotIdCellTemplate } from './components/LotIdCellTemplate';
import { SerialNumberCellTemplate } from './components/SerialNumberCellTemplate';
import { EditableScanLot, SchemaOptions } from './types';

export const buildEqSchema = ({
  onDelete,
  onOpenQuickView,
  onUpdateScanLot,
}: SchemaOptions): Array<ColumnDefinition<EditableScanLot>> => {
  return [
    {
      id: 'lotNumber',
      field: 'lotNumber',
      title: 'scan.lot.grid.equipment.number',
      template: (props) => <LotIdCellTemplate {...props} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'serialNumber',
      field: 'serialNumber',
      title: 'scan.lot.grid.serial.number',
      template: (props) => <SerialNumberCellTemplate {...props} onUpdateScanLot={onUpdateScanLot} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'calDueDate',
      field: 'calDueDate',
      title: 'lhr.equipment.grid.heading.cal.due.date',
      template: (props) => <DateCellTemplate {...props} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'pmDueDate',
      field: 'pmDueDate',
      title: 'lhr.equipment.grid.heading.pm.due.date',
      template: (props) => <DateCellTemplate {...props} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      width: 75,
      filterable: false,
      template: (props) => <ActionsCellTemplate {...props} onDelete={onDelete} onOpenQuickView={onOpenQuickView} />,
    },
  ];
};
