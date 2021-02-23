import { FBApprovalsState, FBAutocompleteAsyncProps, FBDialogState, FBFormState, FBInlineApprovalBody, FBInlineApprovalConstructor, FBInlineApprovalTransition, FBInputProps, FBRequiredApprover } from "..";
import { DocumentStatus } from "../../../state/ducks/documents";

export enum FBApprovalsStatusEndpoint {
  APPROVE = "approve",
  REJECT = "reject",
  PENDING = "pending",
  ABANDON = "abandon",
}

export type FBApprovalsProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "value">
& FBAutocompleteAsyncProps
& {
  onApproveClick?: (approvalId: string) => void;
  requestApproval?: (id?: string) => any;
  approvals?: FBInlineApprovalBody[];
  approvalsState?: FBApprovalsState;
  approvalTransition(transition: FBInlineApprovalTransition, approvalId?: string, password?: string): void;
  docId?: string;
  documentStatus: DocumentStatus;
  formState?: FBFormState;
  groups?: Record<string, FBRequiredApprover>;
  isIncluded?(group: FBRequiredApprover): void;
  ownerId?: string;
  currentUser?: string;
  inlineApprovalExists?: boolean;
  dialogState?: FBDialogState;
  isAlphaReleased?: boolean;
  owners?: Owner[];
  showFieldOwnersWarning?: boolean;
  isContributorIncluded?(id: string): void;
};

export interface Owner {
  name: string;
  id: string;
}

export type FBApprovalsConstructor = FBInlineApprovalConstructor & {
  id: string[];
};

