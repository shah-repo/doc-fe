import { FBEditorProps, FBInputProps } from "..";

export type FBEditorApprovalFieldProps =
& FBEditorProps
& Pick<FBInputProps, "defaultValue" | "approverGroups" | "approvers" | "approvalRoles">
& {
  includeLabel?: boolean;
};
