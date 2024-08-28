import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { ASLCell } from './components/ASLCell';
import { ItemCell } from './components/ItemCell';
import { StatusCell } from './components/StatusCell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableProductORService, SchemaOptions } from './types';

export const buildSchema = ({
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableProductORService>> => {
  return [
    {
      id: 'item',
      field: 'itemId',
      title: 'form.builder.supplier.produc.or.service.grid.heading.item',
      filterable: false,
      template: (props) => <ItemCell {...props} onClick={onRowClick} />,
      width: 300,
    },
    {
      id: 'supplier-part-number',
      field: 'supplierPartNumber',
      title: 'form.builder.supplier.produc.or.service.grid.heading.supplier.part.number',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'lifecycle-phase',
      field: 'lifecyclePhase',
      title: 'form.builder.supplier.produc.or.service.grid.heading.lifecycle.phase',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'status',
      field: 'status',
      title: 'form.builder.supplier.produc.or.service.grid.heading.status',
      filterable: false,
      template: (props) => <StatusCell {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'asl-status',
      field: 'aslStatus',
      title: 'form.builder.supplier.produc.or.service.grid.heading.asl.status',
      filterable: false,
      template: (props) => <ASLCell {...props} onClick={onRowClick} />,
      width: 280,
    },
    {
      id: 'comments',
      field: 'comment',
      title: 'form.builder.supplier.produc.or.service.grid.heading.comments',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 280,
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
