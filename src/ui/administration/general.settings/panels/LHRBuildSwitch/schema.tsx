import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import { AutocompleteCellTemplate } from '../../components/SettingsTable/components/AutocompleteCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { EditableLHRBuildSwitch } from './types';
import { EditableLHRBuild } from '../LHRBuild/types';
import GroupsCellTemplate from './components/GroupsCellTemplate';

export const buildSchema: SchemaBuilder<EditableLHRBuild, EditableLHRBuildSwitch> = ({
  isActive,
  groups,
  onEdit,
  onDiscard,
  onConfirm,
}) => {
  return [
    {
      id: 'from',
      field: 'internalType',
      title: 'administration.general.settings.lhr.build.switch.from',
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'to',
      field: 'internalType',
      title: 'administration.general.settings.lhr.build.switch.to',
      template: AutocompleteCellTemplate,
      width: 200,
    },
    {
      id: 'approvalGroup',
      field: 'approvalGroup',
      title: 'administration.general.settings.lhr.build.switch.approval.group',
      template: (props) => (
      <GroupsCellTemplate
        {...props}
        options={groups}
      />
    ),
      width: 200,
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
