import React from 'react';
import ActionsCellTemplate from '../../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../../components/SettingsTable/types';
import { EditableASLStatus } from './types';

export const buildSchema: SchemaBuilder<EditableASLStatus> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDelete,
  onDiscard,
  onConfirm,
}) => {
  return [
    {
      id: 'active',
      field: 'active',
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
      id: 'internalType',
      field: 'internalType',
      title: 'administration.general.settings.suppliers.enlil.internet',
      template: TextCellTemplate,
    },
    {
      id: 'displayLabel',
      field: 'displayLabel',
      title: 'administration.general.settings.suppliers.customer.label',
      template: TextCellTemplate,
    },
    {
      id: 'actions',
      field: 'actions',
      title: 'common.actions',
      width: 75,
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
