import { FBApprovalRole, FBInputProps } from '..';
import { ErrorField, ERROR_FIELD, Mode, MODE_FIELD, SEARCHABLE_GROUPS_FIELD } from './constants';

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
  [ERROR_FIELD]?: ErrorField
}

export type FBApprovalMatrixRolesProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  groups?: RoleGroup[]
  approvalRoles?: ApprovalRole[]
  addRole?: (role: ApprovalRole) => void
  updateRole?: (role: ApprovalRole) => void
};
