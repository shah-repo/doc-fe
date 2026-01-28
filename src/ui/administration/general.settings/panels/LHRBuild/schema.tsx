import React from 'react';
import { translate } from '../../../../../common/intl';
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
      locked: true,
    },
    {
      id: 'internalType',
      field: 'internalType',
      title: 'administration.general.settings.suppliers.enlil.internal',
      template: AutocompleteCellTemplate,
      width: 200,
      locked: true,
    },
    {
      id: 'displayLabel',
      field: 'displayLabel',
      title: 'administration.general.settings.suppliers.customer.label',
      template: TextCellTemplate,
      width: 200,
      locked: true,
    },
    {
      id: 'calOrPm',
      field: 'calOrPm',
      title: 'administration.general.settings.build.type.allow.cal.or.pm',
      headerTemplate: <span style={{ whiteSpace: 'normal', textAlign: 'center', display: 'block' }}>
      {translate('administration.general.settings.build.type.allow.cal.or.pm')}
    </span>,
      template: AutocompleteCellTemplate,
    },
    {
      id: 'lotQtyLessQtyNeeded',
      field: 'lotQtyLessQtyNeeded',
      title: 'administration.general.settings.build.type.allow.lot.qty.less.qty.needed',
      template: AutocompleteCellTemplate,
    },
    {
      id: 'qtyDiscrepancy',
      field: 'qtyDiscrepancy',
      title: 'administration.general.settings.build.type.allow.qty.discrepancy',
      template: AutocompleteCellTemplate,
    },
    {
      id: 'lotSelection',
      field: 'lotSelection',
      title: 'administration.general.settings.build.type.allow.require.lot.selection',
      template: AutocompleteCellTemplate,
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
