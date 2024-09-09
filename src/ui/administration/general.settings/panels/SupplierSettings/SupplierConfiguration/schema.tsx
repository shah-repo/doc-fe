import React from 'react';
import ActionsCellTemplate from '../../../components/SettingsTable/components/ActionsCellTemplate';
import { SchemaBuilder } from '../../../components/SettingsTable/types';
import { SupplierDropDownCell } from './components/SupplierDropDownCell';
import { EditableSupplierConfig } from './types';

export const buildSchema: SchemaBuilder<EditableSupplierConfig> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDelete,
  onDiscard,
  onConfirm,
}) => {
  return [
    {
      id: 'supplierType',
      field: 'supplierType',
      title: 'administration.general.settings.suppliers.enlil.supplier.type',
      template: (props) => <SupplierDropDownCell {...props} dataOptions={[]} />,
    },
    {
      id: 'supplierCapabilities',
      field: 'supplierCapabilities',
      title: 'administration.general.settings.suppliers.enlil.supplier.capabilities',
      template: (props) => <SupplierDropDownCell {...props} dataOptions={[]} />,
    },
    {
      id: 'supplierServices',
      field: 'supplierServices',
      title: 'administration.general.settings.suppliers.enlil.supplier.services',
      template: (props) => <SupplierDropDownCell {...props} dataOptions={[]} />,
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
