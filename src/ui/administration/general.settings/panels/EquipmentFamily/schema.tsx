import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { EditableEquipmentLocation } from './types';

export const buildSchema: SchemaBuilder<EditableEquipmentLocation> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDelete,
  onDiscard,
  onConfirm,
}) => ([
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
    id: 'name',
    field: 'name',
    title: 'common.name',
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
        onEdit={onEdit}
        onDelete={onDelete}
        onDiscard={onDiscard}
        onConfirm={onConfirm}
        isActive={isActive}
      />
    ),
  },
]);
