import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import { AutocompleteCellTemplate } from '../../components/SettingsTable/components/AutocompleteCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { EditableLHRBuild } from './types';

export const buildSchema: SchemaBuilder<EditableLHRBuild> = ({
  isActive,
  onEdit,
  onActiveStateChange,
  onDiscard,
  onConfirm,
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
      id: 'internalType',
      field: 'internalType',
      title: 'administration.general.settings.suppliers.enlil.internal',
      template: AutocompleteCellTemplate,
    },
    {
      id: 'displayLabel',
      field: 'displayLabel',
      title: 'administration.general.settings.suppliers.customer.label',
      template: TextCellTemplate,
      width: 360,
    },
    {
      id: 'calOrPm',
      field: 'calOrPm',
      title: 'administration.general.settings.build.type.allow.cal.or.pm',
      template: TextCellTemplate,
      width: 60,
    },
    {
      id: 'lotQtyLessQtyNeeded',
      field: 'lotQtyLessQtyNeeded',
      title: 'administration.general.settings.build.type.allow.lot.qty.less.qty.needed',
      template: TextCellTemplate,
      width: 60,
    },
    {
      id: 'qtyDiscrepancy',
      field: 'qtyDiscrepancy',
      title: 'administration.general.settings.build.type.allow.qty.discrepancy',
      template: TextCellTemplate,
      width: 60,
    },
    {
      id: 'lotSelection',
      field: 'lotSelection',
      title: 'administration.general.settings.build.type.allow.require.lot.selection',
      template: TextCellTemplate,
      width: 60,
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
          onDiscard={onDiscard}
          onConfirm={onConfirm}
        />
      ),
    },
  ];
};
