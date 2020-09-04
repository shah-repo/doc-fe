import { FBApprovalsState, FBFormState, FBInputProps, FBRequiredApprover } from "..";
import { Approval } from "../../../state/ducks/common";
import { DocumentStatus } from "../../../state/ducks/documents";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export enum FBApprovalsStatusEndpoint {
  APPROVE = "approve",
  REJECT = "reject",
  PENDING = "pending",
  ABANDON = "abandon",
}

export type FBApprovalsProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& {
  handleAdd(value: any, test: any): any;
  groups?: Record<string, FBRequiredApprover>;
  loading?: boolean;
  approvalsState?: FBApprovalsState;
  formState?: FBFormState;
  approvals?: Approval[];
  availableApprovers: OptionType[];
  isIncluded?(group: FBRequiredApprover): void;
  documentStatus: DocumentStatus;
  currentEmployeeId: string;
  changeApprovalStatus(transition: "approve" | "reject"): void;
  docId?: string;
};
