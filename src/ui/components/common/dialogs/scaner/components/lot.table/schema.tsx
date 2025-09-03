import React from 'react';
import { ColumnDefinition } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import { LotIdCellTemplate } from './components/LotIdCellTemplate';
import { QuantityAssignedCellTemplate } from './components/QuantityAssignedCellTemplate';
import { SerialNumberCellTemplate } from './components/SerialNumberCellTemplate';
import { UnitsCellTemplate } from './components/UnitsCellTemplate';
import { EditableScanLot, SchemaOptions } from './types';

export const buildSchema = ({
  isSerialNumberHidden,
  onDelete,
  onOpenQuickView,
  onUpdateScanLot,
}: SchemaOptions): Array<ColumnDefinition<EditableScanLot>> => {
  return [
    {
      id: 'lotNumber',
      field: 'lotNumber',
      title: 'scan.lot.grid.lot.number',
      template: (props) => <LotIdCellTemplate {...props} />,
      filterable: false,
      width: 150,
    },
    ...(isSerialNumberHidden
      ? []
      : [
        {
          id: 'serialNumber',
          field: 'serialNumber',
          title: 'scan.lot.grid.serial.number',
          template: (props) => <SerialNumberCellTemplate {...props} onUpdateScanLot={onUpdateScanLot} />,
          filterable: false,
          width: 150,
        },
      ]),
    {
      id: 'quantityAssigned',
      field: 'quantityAssigned',
      title: 'scan.lot.grid.quantity.assigned',
      template: (props) => <QuantityAssignedCellTemplate {...props} onUpdateScanLot={onUpdateScanLot} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'unitOfMeasure',
      field: 'unitOfMeasure',
      title: 'scan.lot.grid.unit.of.measure',
      template: (props) => <UnitsCellTemplate {...props} />,
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
          onDelete={onDelete}
          onOpenQuickView={onOpenQuickView}
        />
      ),
    },
  ];
};
