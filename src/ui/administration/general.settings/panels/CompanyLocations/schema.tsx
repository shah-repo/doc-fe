import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { IncludedInTotalQtyCellTemplate } from './components/IncludedInTotalQtyCellTemplate';
import { EditableCompanyLocation } from './types';

export const buildSchema: SchemaBuilder<EditableCompanyLocation> = ({
  isActive,
  onEdit,
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
      template: ActiveCellTemplate,
    },
    {
      id: 'name',
      field: 'name',
      title: 'common.name',
      template: TextCellTemplate,
    },
    {
      id: 'includedInTotalQty',
      field: 'includedInTotalQty',
      title: 'settings.locations.included.total.quantity',
      template: IncludedInTotalQtyCellTemplate,
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
