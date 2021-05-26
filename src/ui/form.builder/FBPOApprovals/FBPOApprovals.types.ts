import { FBAutocompleteAsyncProps, FBInlineApprovalBody, FBInlineApprovalConstructor, FBInlineApprovalTransition, FBInputProps, FBPOApprovalsState, FBRequiredApprover, Owner } from "..";

export type FBPOApprovalsProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "value">
& FBAutocompleteAsyncProps
& {
  approvals?: FBInlineApprovalBody[];
  poApprovalsState?: FBPOApprovalsState;
  approvalTransition(transition: FBInlineApprovalTransition, approvalId?: string, password?: string): void;
  docId?: string;
  groups?: Record<string, FBRequiredApprover>;
  checkedGroups?: any[];
  isIncluded?(group: FBRequiredApprover): void;
  owners?: Owner[];
};

export type FBPOApprovalsConstructor = FBInlineApprovalConstructor & {
  id: string[];
};
