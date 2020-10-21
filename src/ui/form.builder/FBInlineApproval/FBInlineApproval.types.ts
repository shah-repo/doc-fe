import { FBEmployee, FBGroup, FBId, FBInlineApprovalRole, FBInputProps, FBProviderProps } from "..";
import { FBDialogState } from "../FBDialog/FBDialog.state";

export interface FBInlineApprovalValue {
  approvers?: string[] | FBEmployee[];
  groups?: string[] | FBGroup[];
  roles?: string[] | FBInlineApprovalRole[];
  isApproved?: boolean;
}

export type FBInlineApprovalProps =
& Omit<FBInputProps, "editorConfig">
& Pick<FBProviderProps, "inlineApprovalState">
& {
  approvalTransition?: (transition: FBInlineApprovalTransition, id?: string) => any;
  onApproveClick?: (approvalId: string) => void;
  editorConfig?: FBInlineApprovalValue;
  approvals?: FBInlineApprovalBody[];
  currentUser?: string;
  isApproved?: boolean;
  isPreview?: boolean;
  isOutput?: boolean;
  dialogState?: FBDialogState;
};

export type FBInlineApprovalOptions = FBEmployee & {
  listGroup: string;
};

export type FBInlineApprovalType = "MASTER" | "SECTION";
export type FBInlineApprovalStatus = "DRAFT" | "PENDING" | "ABANDONED" | "APPROVED" | "REJECTED";
export type FBInlineApprovalTransition = "abandon" | "pending" | "approve" | "reject";

export enum FBInlineApprovalStatusIdent {
  DRAFT = "Draft",
  PENDING = "Pending approval",
  ABANDONED = "Abandoned",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface FBInlineApprovalBody {
  reviewedAt?: string;
  id?: string;
  assigned?: FBId;
  type: FBInlineApprovalType;
  fieldId: string;
  partOf: FBId;
  status?: FBInlineApprovalStatus;
  approver?: FBEmployee;
  canRequest?: boolean;
}

export interface FBInlineApprovalTransitionBody {
  password: string;
}

export interface FBInlineApprovalConstructor {
  approvals?: FBInlineApprovalBody[];
  isOwner?: boolean;
}


