import React from 'react';
import ActionsCellTemplate from '../../../components/SettingsTable/components/ActionsCellTemplate';
import TextCellTemplate from '../../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../../components/SettingsTable/types';
import { OptionType } from '../SupplierConfiguration/types';
import ActiveCell from './components/ActiveCell';
import { ASLTypeCell } from './components/ASLTypeCell';
import { EditableASLStatus } from './types';

export const buildSchema: SchemaBuilder<EditableASLStatus> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDelete,
  onDiscard,
  types,
  onConfirm,
}) => {
  return [
    {
      id: 'isActive',
      field: 'isActive',
      title: 'common.active',
      width: 70,
      template: (props) => (
        <ActiveCell {...props} onActiveStateChange={onActiveStateChange} />
      ),
    },
    {
      id: 'internalType',
      field: 'internalType',
      title: 'administration.general.settings.suppliers.enlil.internal',
      template: (props) => (
        <ASLTypeCell {...props} dataOptions={types as OptionType[]} />
      ),
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
