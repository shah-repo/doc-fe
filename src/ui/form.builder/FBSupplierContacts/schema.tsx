import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import PrimarySupplier from './components/PrimarySupplier';
import { PrimarySupplierCellTemplate } from './components/PrimarySupplierCellTemplate';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableSupplierContact, SchemaOptions } from './types';

export const buildSchema = ({
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  onPrimaryChange,
}: SchemaOptions): Array<ColumnDefinition<EditableSupplierContact>> => {
  return [
    {
      id: 'isPrimary',
      field: 'isPrimary',
      filterable: false,
      headerCell: PrimarySupplier,
      template: (props) => (
        <PrimarySupplierCellTemplate
          {...props}
          onPrimaryChange={onPrimaryChange}
          isActive={isActive}
          isInEditMode={isInEditMode}
        />
      ),
      width: 50,
    },
    {
      id: 'name',
      field: 'name',
      title: 'form.builder.supplier.contacts.grid.heading.name',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'title',
      field: 'title',
      title: 'form.builder.supplier.contacts.grid.heading.title',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 120,
    },
    {
      id: 'email-address',
      field: 'email',
      title: 'form.builder.supplier.contacts.grid.heading.email.address',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'phoneNumber',
      field: 'phoneNumber',
      title: 'form.builder.supplier.contacts.grid.heading.phone.number',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'address',
      field: 'address',
      title: 'form.builder.supplier.contacts.grid.heading.address',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.supplier.contacts.grid.heading.comments',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
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
