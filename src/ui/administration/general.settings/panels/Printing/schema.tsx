import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { EditablePrinter } from './types';

export const buildSchema: SchemaBuilder<EditablePrinter> = ({
  isActive,
  onEdit,
  onDelete,
  onDiscard,
  onConfirm,
}) => ([
  {
    id: 'active',
    field: 'active',
    title: 'common.active',
    width: 70,
    template: ActiveCellTemplate,
  },
  {
    id: 'sn',
    field: 'printer.sn',
    title: 'administration.general.settings.printing.table.column.serial.number',
    template: TextCellTemplate,
  },
  {
    id: 'name',
    field: 'printer.name',
    title: 'administration.general.settings.printing.table.column.name',
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
