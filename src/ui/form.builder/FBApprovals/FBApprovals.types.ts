import { FBApprovalsState, FBAutocompleteAsyncProps, FBFormState, FBInputProps, FBRequiredApprover } from "..";
import { Approval } from "../../../state/ducks/common";
import { DocumentStatus } from "../../../state/ducks/documents";

export enum FBApprovalsStatusEndpoint {
  APPROVE = "approve",
  REJECT = "reject",
  PENDING = "pending",
  ABANDON = "abandon",
}

export type FBApprovalsProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& FBAutocompleteAsyncProps
& {
  approvals?: Approval[];
  approvalsState?: FBApprovalsState;
  changeApprovalStatus(transition: FBApprovalsStatusEndpoint, approvalId: string): void;
  currentEmployeeId: string;
  docId?: string;
  documentStatus: DocumentStatus;
  formState?: FBFormState;
  groups?: Record<string, FBRequiredApprover>;
  isIncluded?(group: FBRequiredApprover): void;
  ownerId?: string;
};
