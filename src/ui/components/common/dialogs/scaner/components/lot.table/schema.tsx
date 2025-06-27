import React from 'react';
import { ColumnDefinition } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import { EditableScanLot, SchemaOptions } from './types';

export const buildSchema = ({
  isInEditMode,
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
      filterable: false,
      width: 150,
    },
    {
      id: 'serialNumber',
      field: 'serialNumber',
      title: 'scan.lot.grid.serial.number',
      filterable: false,
      width: 150,
    },
    {
      id: 'quantityAssigned',
      field: 'quantityAssigned',
      title: 'scan.lot.grid.quantity.assigned',
      filterable: false,
      width: 150,
    },
    {
      id: 'unitOfMeasure',
      field: 'unitOfMeasure',
      title: 'scan.lot.grid.unit.of.measure',
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
    // {
    //   id: 'units-buy',
    //   field: 'unitsBuy',
    //   title: 'form.builder.part.vendors.unitsBuy',
    //   filterCell: UnitsFilter,
    //   template: (props) => <UnitsCellTemplate {...props} options={units} onClick={onRowClick} />,
    //   width: 150,
    // },
    // {
    //   id: 'lead-time',
    //   field: 'leadTime',
    //   title: 'form.builder.part.vendors.leadTime',
    //   filterCell: InputFilter,
    //   template: (props) => <NumericCellTemplate {...props} onClick={onRowClick} />,
    //   width: 150,
    // },
  ];
};
