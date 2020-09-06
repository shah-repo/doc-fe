import { FBEmployee, FBGroup, FBInlineApprovalRole, FBInputProps, FBProviderProps, FBUser } from "..";

export interface FBInlineApprovalValue {
  approvers?: string[] | FBEmployee[];
  groups?: string[] | FBGroup[];
  roles?: string[] | FBInlineApprovalRole[];
}

export type FBInlineApprovalProps =
& Omit<FBInputProps, "defaultValue">
& Pick<FBProviderProps, "inlineApprovalState">
& {
  defaultValue?: FBInlineApprovalValue;
};

export type FBInlineApprovalOptionType = "Approvers" | "Groups" | "Roles";

export type FBInlineApprovalOptions = FBUser & {
  type: FBInlineApprovalOptionType;
};
