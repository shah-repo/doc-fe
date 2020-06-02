import { FBApprovalRole, FBButtonProps, FBDialogState, FBInputProps } from "..";

export type FBApprovalMatrixRolesProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBButtonProps, "onClick">
& {
  approvalRoles?: FBApprovalRole[];
  dialogState?: FBDialogState;
};
