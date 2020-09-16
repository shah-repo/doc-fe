import { FBEmployee, FBGroup, FBId, FBInlineApprovalRole, FBInputProps, FBProviderProps } from "..";

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
  editorConfig?: FBInlineApprovalValue;
  approvals?: FBInlineApprovalBody[];
  currentUser?: string;
  isApproved?: boolean;
  isPreview?: boolean;
  isComponentVisible?: boolean;
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
  REJECT = "Rejected",
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

export interface FBInlineApprovalConstructor {
  approvals?: FBInlineApprovalBody[];
  isOwner?: boolean;
}


