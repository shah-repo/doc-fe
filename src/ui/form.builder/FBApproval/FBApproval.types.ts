import { BoxProps } from "@material-ui/core";
import { FBApprovalState } from ".";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBInputProps } from "../types/common";

export interface FBApprovalConfig {
  label?: string;
  isVisible?: boolean;
  status?: string;
  canApprove?: boolean;
}

export type FBApprovalProps =
& Pick<FBInputProps, "name" | "label" | "type" | "approvers" | "approverGroups" | "disabled" | "approveIsBlocking">
& {
  onApprove?: (approver: Employee | GroupRequestBody | undefined) => () => void;
  approvalConfig?: (approver?: Employee | GroupRequestBody) => FBApprovalConfig | undefined;
  approvalFieldState?: FBApprovalState;
  hasApproved?: FBApprovalValue[];
  isApproved?: boolean;
  isDefined?: boolean;
};

export enum FBApprovalStatus {
  Pending = "",
  Approved = "| Approved"
}

export interface FBApprovalValue {
  email: string;
  groupId?: string;
  approvedAt: string;
  notify: boolean;
}

export type FBApprovalFieldProps<T> =
& FBApprovalProps
& Pick<BoxProps, "mt">
& {
  collection: T[];
};
