import React from 'react';
import { CompanyLocation } from '../../../../../state/ducks/company/types';
import ActionsCellTemplate from '../../components/SettingsTable/components/ActionsCellTemplate';
import { SchemaBuilder } from '../../components/SettingsTable/types';
import GroupsCellTemplate from './components/GroupsCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import { EditableMaterialFlowAclRule, GroupOption } from './types';

interface SchemaOptions {
  groups: GroupOption[]
  locations: CompanyLocation[]
}

export const buildSchema: SchemaBuilder<EditableMaterialFlowAclRule, SchemaOptions> = ({
  groups,
  locations,
  isActive,
  onEdit,
  onDelete,
  onDiscard,
  onConfirm,
}) => ([
  {
    id: 'type',
    field: 'action',
    title: 'common.token.action',
    template: TransferTypeCellTemplate,
    width: 150,
    sortable: true,
  },
  {
    id: 'groups',
    field: 'groups',
    title: 'common.groups',
    template: (props) => (
      <GroupsCellTemplate
        {...props}
        options={groups}
      />
    ),
    sortable: true,
  },
  {
    id: 'from',
    field: 'from',
    title: 'administration.general.settings.material.flow.location.from',
    template: (props) => (
      <LocationCellTemplate
        {...props}
        options={locations}
      />
    ),
    sortable: true,
  },
  {
    id: 'to',
    field: 'to',
    title: 'administration.general.settings.material.flow.location.to',
    template: (props) => (
      <LocationCellTemplate
        {...props}
        options={locations}
      />
    ),
    sortable: true,
  },
  {
    id: 'actions',
    field: 'actions',
    title: 'common.actions',
    width: 75,
    template: (props) => (
      <ActionsCellTemplate
        {...props}
        onEdit={onEdit}
        onDelete={onDelete}
        onDiscard={onDiscard}
        onConfirm={onConfirm}
        isActive={isActive}
      />
    ),
    sortable: false,
  },
]);
