import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { DateCell } from './components/DateCell';
import { IDCell } from './components/IDCell';
import { OwnerCell } from './components/OwnerCell';
import { StatusCell } from './components/StatusCell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableReference, SchemaOptions } from './types';

export const buildSchema = ({
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableReference>> => {
  return [
    {
      id: 'reference',
      field: 'referenceId',
      title: 'form.builder.supplier.references.grid.heading.reference.id',
      filterable: false,
      template: (props) => <IDCell {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'revision',
      field: 'revision',
      title: 'form.builder.supplier.references.grid.heading.revision',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 80,
    },
    {
      id: 'title',
      field: 'title',
      title: 'form.builder.supplier.references.grid.heading.title',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 310,
    },
    {
      id: 'status',
      field: 'status',
      title: 'form.builder.supplier.references.grid.heading.status',
      filterable: false,
      template: (props) => <StatusCell {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'created-date',
      field: 'createdDate',
      title: 'form.builder.supplier.references.grid.heading.created.date',
      filterable: false,
      template: (props) => <DateCell {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'owner',
      field: 'owner',
      title: 'form.builder.supplier.references.grid.heading.owner',
      filterable: false,
      template: (props) => <OwnerCell {...props} onClick={onRowClick} />,
      width: 140,
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
