import React from 'react';
import ActionsCellTemplate from '../../../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../../../components/SettingsTable/types';
import { EditableSupplierLabel } from './types';

export const buildSchema: SchemaBuilder<EditableSupplierLabel> = ({
  isActive,
  onEdit,
  onDelete,
  onDiscard,
  onConfirm,
  onActiveStateChange,
}) => {
  return [
    {
      id: 'isActive',
      field: 'isActive',
      title: 'common.active',
      width: 70,
      template: (props) => (
        <ActiveCellTemplate
          {...props}
          onActiveStateChange={onActiveStateChange}
        />
      ),
    },
    {
      id: 'text',
      field: 'text',
      width: 200,
      title: 'common.label',
      template: TextCellTemplate,
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
          isActive={isActive}
          onEdit={onEdit}
          onDelete={onDelete}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
    },
  ];
};
