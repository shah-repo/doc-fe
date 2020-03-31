import { FBApprovalFieldState } from ".";
import { UserState } from "../../../state/ducks/auth/types";
import { FBInputProps } from "../types/common";

export type FBApprovalFieldIdentifier = "approver" | "group";

export type FBApprovalFieldProps =
& Pick<FBInputProps, "name" | "type" | "approvers" | "approverGroups" | "disabled" | "approveIsBlocking">
& {
  approverStatusInfo?: (identifier: string | undefined) => string;
  canApprove?: (identifier: string | undefined) => boolean;
  onClick?: (identifierType: FBApprovalFieldIdentifier) => () => void;
  approverIsVisible?: (identifier: string | undefined) => boolean;
  approvalFieldState?: FBApprovalFieldState;
  hasApproved?: FBApprovedFieldValue[];
  currentUser?: UserState;
  isBlocked?: boolean;
};

export enum FBApprovalStatus {
  Pending = "",
  Approved = "| Approved"
}

export interface FBApprovedFieldValue {
  identifier: string;
  approvedAt: string;
}
