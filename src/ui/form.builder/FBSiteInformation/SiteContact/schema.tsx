import React from 'react';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { PrimaryCell } from './components/PrimaryCell';
import { TextFieldCellTemplate } from './components/TextFieldCellTemplate';
import { EditableSiteContact, SchemaOptions } from './types';

export const buildSchema = ({
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableSiteContact>> => {
  return [
    {
      id: 'primary',
      field: 'primary',
      filterable: false,
      title: 'form.builder.contact.grid.heading.primary',
      template: (props) => (
        <PrimaryCell
          {...props}
          isActive={isActive}
          isInEditMode={isInEditMode}
        />
      ),
      width: 60,
    },
    {
      id: 'shipping',
      field: 'shipping',
      title: 'form.builder.contact.grid.heading.shipping',
      filterable: false,
      template: (props) => (
        <PrimaryCell
          {...props}
          isActive={isActive}
          isInEditMode={isInEditMode}
        />
      ),
      width: 60,
    },
    {
      id: 'attention',
      field: 'attention',
      title: 'form.builder.contact.grid.heading.attention',
      filterable: false,
      template: (props) => (
        <PrimaryCell
          {...props}
          isActive={isActive}
          isInEditMode={isInEditMode}
        />
      ),
      width: 60,
    },
    {
      id: 'email',
      field: 'email',
      title: 'form.builder.contact.grid.heading.email',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'phoneNumber',
      field: 'phoneNumber',
      title: 'form.builder.contact.grid.heading.phone.number',
      filterable: false,
      template: (props) => <TextFieldCellTemplate {...props} onClick={onRowClick} />,
      width: 150,
    },
    {
      id: 'other',
      field: 'other',
      title: 'form.builder.contact.grid.heading.other',
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
