import { ButtonProps } from "@material-ui/core";
import { FBApprovalFieldState } from ".";
import { User } from "../../../state/ducks/common";
import { FBInputProps } from "../types/common";

export type FBApprovalFieldProps =
& Pick<FBInputProps, "name" | "type" | "approvers">
& Pick<ButtonProps, "onClick">
& {
  approverStatus?: (email: string | undefined) => string;
  canApprove?: (email: string | undefined) => boolean;
  approvalFieldState?: FBApprovalFieldState;
  hasApproved?: string[];
  currentUser?: User;
};

export enum FBApprovalStatus {
  Pending = "Pending Approval",
  Approved = "Approved"
}
