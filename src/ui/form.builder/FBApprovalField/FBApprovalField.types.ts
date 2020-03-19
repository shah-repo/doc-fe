import { FBApprovalFieldState } from ".";
import { UserState } from "../../../state/ducks/auth/types";
import { FBInputProps } from "../types/common";

export type FBApprovalFieldIdentifier = "approver" | "group";

export type FBApprovalFieldProps =
& Pick<FBInputProps, "name" | "type" | "approvers" | "approverGroups" | "disabled">
& {
  approverStatus?: (email: string | undefined) => string;
  canApprove?: (email: string | undefined) => boolean;
  onClick?: (identifierType: FBApprovalFieldIdentifier) => () => void;
  approvalFieldState?: FBApprovalFieldState;
  hasApproved?: string[];
  currentUser?: UserState;
};

export enum FBApprovalStatus {
  Pending = "Pending Approval",
  Approved = "Approved"
}
