import React from 'react';
import ActionsCellTemplate from '../../../components/SettingsTable/components/ActionsCellTemplate';
import { SchemaBuilder } from '../../../components/SettingsTable/types';
import { SupplierDropDownCell } from './components/SupplierDropDownCell';
import { TypeCell } from './components/TypeCell';
import { EditableSupplierConfig, OptionType } from './types';

export const buildSchema: SchemaBuilder<EditableSupplierConfig> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDelete,
  capabilities,
  services,
  types,
  onDiscard,
  onConfirm,
}) => {
  return [
    {
      id: 'text',
      field: 'text',
      title: 'administration.general.settings.suppliers.enlil.supplier.type',
      template: (props) => <TypeCell {...props} dataOptions={types as OptionType[]} />,
    },
    {
      id: 'capabilities',
      field: 'capabilities',
      title: 'administration.general.settings.suppliers.enlil.supplier.capabilities',
      template: (props) => <SupplierDropDownCell {...props} dataOptions={capabilities as OptionType[]} />,
    },
    {
      id: 'services',
      field: 'services',
      title: 'administration.general.settings.suppliers.enlil.supplier.services',
      template: (props) => <SupplierDropDownCell {...props} dataOptions={services as OptionType[]} />,
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
