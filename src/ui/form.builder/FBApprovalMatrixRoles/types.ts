import { FBApprovalRole, FBInputProps } from '..';
import { MODE_FIELD, Mode, SEARCHABLE_GROUPS_FIELD } from './constants';

export interface RoleGroup {
  id: string
  name: string
}

export interface RoleEditEvent {
  dataItem: EditableRole
}

interface ApprovalRole extends FBApprovalRole {
  groups: RoleGroup[]
}

export interface EditableRole extends ApprovalRole {
  [MODE_FIELD]: Mode
  [SEARCHABLE_GROUPS_FIELD]: string
}

export type FBApprovalMatrixRolesProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  groups: RoleGroup[]
  approvalRoles: ApprovalRole[]
  addRole: (role: ApprovalRole) => void
  updateRole: (role: ApprovalRole) => void
};
