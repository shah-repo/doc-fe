import { FBApprovalRole, FBInputProps } from '..';
import { ERROR_FIELD, ErrorField, Mode, MODE_FIELD, SEARCHABLE_GROUPS_FIELD } from './constants';

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
  updateRole?: (role: ApprovalRole) => void
};
