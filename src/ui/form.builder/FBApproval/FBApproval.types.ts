import { FBApprovalState, FBInputProps } from "..";
import { Employee } from "../../../state/ducks/company/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";

export interface FBApprovalConfig {
  label?: string;
  isVisible?: boolean;
  status?: string;
  canApprove?: boolean;
}

export type FBApprovalProps =
& Pick<FBInputProps,
| "name"
| "label"
| "type"
| "index"
| "approvers"
| "approverGroups"
| "approvalRoles"
| "disabled"
| "approveIsBlocking"
| "reviseDisabled"
| "editorProperties"
| "autosave"
| "gutter"
> & {
  onApprove?: (approver?: FBInlineApproverType) => () => void;
  approvalConfig?: (approver?: FBInlineApproverType) => FBApprovalConfig | undefined;
  approvalState?: FBApprovalState;
  hasApproved?: FBApprovalValue[];
  isApproved?: boolean;
  isDefined?: boolean;
  loading?: boolean;
  approveLoading?: boolean;
  approvalNonVersioned?: boolean;
};

export enum FBApprovalStatus {
  Pending = "| Pending approval",
  Approved = "| Approved"
}

export interface FBApprovalValue {
  id: string;
  userId?: string;
  groupId?: string;
  approvalRoleId?: string;
  approvedAt: string;
}

export interface FBApprovalApi {
  fieldName: string;
  fieldValue: FBApprovalValue[];
}

export type FBApprovalFieldProps<T> = FBApprovalProps & {
  collection: T[];
};

export interface FBApprovalConstructor {
  documentId?: string;
  value?: FBApprovalValue[];
  approversValue?: string[];
  groupsValue?: string[];
  approvalRolesValue?: string[];
}

export interface FBInlineApprovalRole {
  id: string;
  name: string;
  joinedEmployees?: Employee[];
}

export type FBInlineApproverType = Employee | GroupRequestBody | FBInlineApprovalRole;
export type FBApprovalSocketProps = Pick<FBApprovalProps, "name">;
