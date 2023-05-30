import React from 'react';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import GroupsCellTemplate from './components/GroupCellTemplate';
import TextCellTemplate from './components/TextCellTemplate';
import { EditableRole, FBApprovalMatrixRolesProps, RoleEditEvent } from './types';

interface Options {
  groups: FBApprovalMatrixRolesProps['groups']
  actionsClass?: string
  onRowClick?: (e: RoleEditEvent) => void
  discardRole: () => void
  saveRole: () => void
}

export default function createSchema ({
  onRowClick,
  discardRole,
  saveRole,
  groups,
  actionsClass,
}: Options): Array<ColumnDefinition<EditableRole>> {
  return [
    {
      id: 'name',
      field: 'name',
      title: 'form.builder.approval.role',
      template: TextCellTemplate,
      filterCell: InputFilter,
      width: 200,
    },
    {
      id: 'groups',
      field: 'groupsList',
      title: 'form.builder.approving.groups',
      editable: true,
      template: (props) => (
        <GroupsCellTemplate
          {...props}
          groups={groups}
          updateField="groups"
          onClick={onRowClick}
        />
      ),
      filterCell: InputFilter,
    },
    {
      id: 'actions',
      field: 'actions',
      className: actionsClass,
      filterable: false,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={saveRole}
          onDiscard={discardRole}
        />
      ),
      width: 0,
    },
  ];
}
