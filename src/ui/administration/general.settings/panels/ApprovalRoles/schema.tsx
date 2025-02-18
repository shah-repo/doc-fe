import React from 'react';
import { Mode } from '../../../../components/KendoDataGrid/constants';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import ActiveCellTemplate from './components/ActiveCellTemplate';
import { SchemaBuilder } from './types';

export const buildSchema: SchemaBuilder = ({ onChange, onConfirm, onDiscard, mode }) => {
  return [
    {
      id: 'isActive',
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
          isEditButtonHidden
        />
      ),
      width: mode === Mode.add ? 75 : 0,
    },
  ];
};
