import React from 'react';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import AutocompleteCellTemplate from './components/AutocompleteCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import { EditableLHRBuildSwitch, GroupOption } from './types';
import GroupsCellTemplate from './components/GroupsCellTemplate';
import { LHRBuild } from '../LHRBuild/types';

interface Props {
  approvalGroups: GroupOption[]
  LHRBuild: LHRBuild[]
}

export const buildSchema: SchemaBuilder<EditableLHRBuildSwitch, Props> = ({
  approvalGroups,
  LHRBuild,
  onEdit,
  onDiscard,
  onConfirm,
  onDelete,
}) => {
  return [
    {
      id: 'from',
      field: 'from',
      title: 'administration.general.settings.lhr.build.switch.from',
      template: (props) => (<AutocompleteCellTemplate {...props} options={LHRBuild} />),
      width: 200,
    },
    {
      id: 'to',
      field: 'to',
      title: 'administration.general.settings.lhr.build.switch.to',
      template: (props) => (<AutocompleteCellTemplate {...props} options={LHRBuild} />),
      width: 200,
    },
    {
      id: 'approvalGroups',
      field: 'approvalGroups',
      title: 'administration.general.settings.lhr.build.switch.approval.group',
      template: (props) => (<GroupsCellTemplate {...props} options={approvalGroups} />),
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
          isActive={true}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
          onDelete={onDelete}
        />
      ),
    },
  ];
};
