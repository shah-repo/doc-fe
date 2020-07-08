import { BoxProps } from "@material-ui/core";
import { FBApprovalState, FBDialogState, FBInputProps } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBFormState } from "../FBForm";

export interface FBApprovalConfig {
  label?: string;
  isVisible?: boolean;
  status?: string;
  canApprove?: boolean;
}

export type FBApprovalProps =
& Pick<FBInputProps,
| "name"
| "label"
| "type"
| "index"
| "approvers"
| "approverGroups"
| "disabled"
| "approveIsBlocking"
| "reviseDisabled"
> & {
  onApprove?: (approver?: Employee | GroupRequestBody) => () => void;
  approvalConfig?: (approver?: Employee | GroupRequestBody) => FBApprovalConfig | undefined;
  approvalFieldState?: FBApprovalState;
  hasApproved?: FBApprovalValue[];
  isApproved?: boolean;
  isDefined?: boolean;
  loading?: boolean;
  approveLoading?: boolean;
  dialogState?: FBDialogState;
  onClick?: () => void;
  effectiveDate?: string;
  formEffectiveState?: FBFormState;
};

export enum FBApprovalStatus {
  Pending = "| Pending approval",
  Approved = "| Approved"
}

export interface FBApprovalValue {
  id: string;
  userId?: string;
  groupId?: string;
  approvedAt: string;
}

export interface FBApprovalApi {
  fieldName: string;
  fieldValue: FBApprovalValue[];
  effectiveDate: string;
}

export type FBApprovalFieldProps<T> =
& FBApprovalProps
& Pick<BoxProps, "mt">
& {
  collection: T[];
  onClick: (approver?: Employee | GroupRequestBody) => void;
};

export interface FBApprovalData {
  approvers?: Employee[];
  approverGroups?: GroupRequestBody[];
}

export interface FBApprovalSocketMsg {
  data?: {
    message: string;
  };
}

export interface FBApprovalConstructor {
  documentId?: string;
  name?: string;
  value?: FBApprovalValue[];
}
