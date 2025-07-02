import React from 'react';
import { ColumnDefinition } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import { LotIdCellTemplate } from './components/LotIdCellTemplate';
import { QuantityAssignedCellTemplate } from './components/QuantityAssignedCellTemplate';
import { SerialNumberCellTemplate } from './components/SerialNumberCellTemplate';
import { UnitsCellTemplate } from './components/UnitsCellTemplate';
import { EditableScanLot, SchemaOptions } from './types';

export const buildSchema = ({
  isInEditMode,
  units,
  lots,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableScanLot>> => {
  return [
    {
      id: 'lotNumber',
      field: 'lotNumber',
      title: 'scan.lot.grid.lot.number',
      template: (props) => <LotIdCellTemplate {...props} onClick={onRowClick} lots={lots} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'serialNumber',
      field: 'serialNumber',
      title: 'scan.lot.grid.serial.number',
      template: (props) => <SerialNumberCellTemplate {...props} onClick={onRowClick} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'quantityAssigned',
      field: 'quantityAssigned',
      title: 'scan.lot.grid.quantity.assigned',
      template: (props) => <QuantityAssignedCellTemplate {...props} onClick={onRowClick} />,
      filterable: false,
      width: 150,
    },
    {
      id: 'unitOfMeasure',
      field: 'unitOfMeasure',
      title: 'scan.lot.grid.unit.of.measure',
      template: (props) => <UnitsCellTemplate {...props} options={units} onClick={onRowClick} />,
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
          onEdit={onConfirm}
          onDelete={onDelete}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
    },
    // {
    //   id: 'cost',
    //   field: 'cost.value',
    //   title: 'form.builder.part.vendors.cost',
    //   filterCell: InputFilter,
    //   template: (props) => <UnitCostCellTemplate {...props} onClick={onRowClick} />,
    //   width: 150,
    // },
  ];
};
