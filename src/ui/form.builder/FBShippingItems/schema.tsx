import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { QuantityCell } from './components/QuantityCell';
import { RefIDcell } from './components/RefIDcell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableShippingItem, SchemaOptions } from './types';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableShippingItem>> => {
  return [
    {
      id: 'itemId',
      field: 'itemId',
      title: 'form.builder.record.shipping.items.grid.heading.item.id',
      filterable: false,
      template: (props) => <RefIDcell {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'lotNumber',
      field: 'lotNumber',
      title: 'form.builder.record.shipping.items.grid.heading.lot.number',
      filterable: false,
      template: (props) => <RefIDcell {...props} onClick={onRowClick} />,
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
