import { FBAutocompleteAsyncProps, FBDialogState, FBInlineApprovalBody, FBInlineApprovalConstructor, FBInlineApprovalTransition, FBInputProps, FBPOApprovalsState, FBRequiredApprover, Owner } from "..";
import { DocumentStatus } from "../../../state/ducks/documents/types";

export type FBPOApprovalsProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "value">
& FBAutocompleteAsyncProps
& {
  approvalTransition(transition: FBInlineApprovalTransition, approvalId?: string, password?: string): void;
  isIncluded?(group: FBRequiredApprover): void;
  onApproveClick?: (approvalId: string) => void;
  approvals?: FBInlineApprovalBody[];
  poApprovalsState?: FBPOApprovalsState;
  docId?: string;
  groups?: Record<string, FBRequiredApprover>;
  checkedGroups?: any[];
  owners?: Owner[];
  currentUser?: string;
  documentStatus: DocumentStatus;
  dialogState?: FBDialogState;
};

export type FBPOApprovalsConstructor = FBInlineApprovalConstructor & {
  id: string[];
};
