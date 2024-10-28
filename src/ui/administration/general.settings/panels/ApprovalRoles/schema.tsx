import React from 'react';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import ActiveCellTemplate from './components/ActiveCellTemplate';
import { SchemaBuilder } from './types';

export const buildSchema: SchemaBuilder = ({ onChange, onConfirm, onDiscard, editedApprovalRoles }) => {
  return [
    {
      id: 'active',
      field: 'isActive',
      title: 'common.active',
      width: 80,
      template: (props) => (
        <ActiveCellTemplate
          {...props}
          onChange={onChange}
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
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          hideEditButton
        />
      ),
      width: editedApprovalRoles?.[MODE_FIELD] === Mode.add ? 75 : 0,
    },
  ];
};
