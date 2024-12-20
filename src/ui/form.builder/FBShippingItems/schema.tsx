import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { ItemIDcell } from './components/ItemIDcell';
import { LotIDCell } from './components/LotIDCell';
import { QuantityCell } from './components/QuantityCell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableShippingItem, SchemaOptions } from './types';

export const buildSchema = ({
  lots,
  parts,
  isLotsloading,
  isPartsloading,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  fetchLotsByPartId,
}: SchemaOptions): Array<ColumnDefinition<EditableShippingItem>> => {
  return [
    {
      id: 'part',
      field: 'part',
      title: 'form.builder.record.shipping.items.grid.heading.part',
      filterable: false,
      template: (props) => <ItemIDcell {...props} options={parts} loading={isPartsloading} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'lot',
      field: 'lot',
      title: 'form.builder.record.shipping.items.grid.heading.lot',
      filterable: false,
      template: (props) => <LotIDCell {...props} options={lots} loading={isLotsloading} fetchLotsByPartId={fetchLotsByPartId} onClick={onRowClick} />,
      width: 310,
    },
    {
      id: 'quantity',
      field: 'quantity',
      title: 'form.builder.record.shipping.items.grid.heading.quantity',
      filterable: false,
      template: (props) => <QuantityCell {...props} onClick={onRowClick} />,
      width: 120,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.record.shipping.items.grid.heading.comments',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 250,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};
